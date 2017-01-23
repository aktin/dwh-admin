package org.aktin.dwh.admin.report;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Hashtable;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;

import javax.inject.Inject;
import javax.inject.Singleton;

import org.aktin.report.GeneratedReport;
import org.aktin.report.Report;
import org.aktin.report.ReportArchive;
import org.aktin.report.ReportManager;

/**
 * Keep track of asynchronously created reports and put them in the archive after completion.
 * In case of error, the appropriate exceptions are returned.
 * TODO tracker not needed anymore: archive can do this
 * @author R.W.Majeed
 *
 */
@Singleton
public class ReportTracker {

	private ReportManager manager;
	private ReportArchive archive;
	private AtomicInteger idSequence;

	private Map<Integer, Item> pending;

	public enum State{
		Pending, Generated, Failed
	}
	public static class Item{
		ReportRequest request;
		Path path;
		State state;
		CompletableFuture<? extends GeneratedReport> future;
		Integer archiveId;
		Throwable error;

		Item(int id, ReportRequest request, Path path){
			this.request = request;
			this.path = path;
			this.state = State.Pending;
		}

		public ReportRequest getRequest(){ return request;}
		public State getState(){ return state;}
		public Throwable getError(){ return error;}
		public Integer getArchiveId(){ return archiveId;}
	}
	@Inject
	public ReportTracker(ReportManager manager, ReportArchive archive){
		this.manager = manager;
		this.archive = archive;
		this.pending = new Hashtable<>();
		this.idSequence = new AtomicInteger();
	}

	// TODO add methods to list pending/failed reports in chronological order
	
	public int createReport(Report report, ReportRequest request, Path path) throws IOException{
		// TODO use preferences to retrieve correct zone id
		ZoneId tz = ZoneId.of("Europe/Berlin");
		Instant from = Instant.parse(request.from);
		// convert to local date time for period operations (e.g. plus 1 month)
		LocalDateTime dt = LocalDateTime.ofInstant(from, tz);
		dt = dt.plus(report.getDefaultPeriod());
		// convert back to instant
		Instant to = dt.toInstant(tz.getRules().getOffset(dt));
		int id = idSequence.incrementAndGet();
		final Item item = new Item(id, request, path);
		item.future = manager.generateReport(report, from, to, path )
				.whenComplete( (r,t) -> onReportFinished(item, r, t) );
		pending.put(id, item);
		
		return id;
	}
	public Item getReport(int id){
		return pending.get(id);
	}

	public void deleteReport(int id){
		pending.remove(id);
		// TODO make sure that if a report is deleted, it is not added to the archive after completion
	}
	private void onReportFinished(Item item, GeneratedReport report, Throwable error){
		if( error != null ){
			// remove temporary file
			try {
				Files.delete(item.path);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				// log warning
				e.printStackTrace();
			}
			// change state to failure
			item.error = error;
			item.state = State.Failed;
			
		}else if( report != null ){
			// report completed
			// future should have produced this report
			if( !item.future.isDone() || report != item.future.getNow(null) ){
				throw new AssertionError();
			}
			// move report to archive
			try {
				item.archiveId = archive.addReport(report, "TODO:user").getId();
				item.state = State.Generated;
			} catch (IOException e) {
				// failed to move report to archive
				item.error = new IOException("Failed to move report to archive", e);
				item.state = State.Failed;
			}
		}
		// clear future
		item.future = null;
		item.path = null;
	}
}
