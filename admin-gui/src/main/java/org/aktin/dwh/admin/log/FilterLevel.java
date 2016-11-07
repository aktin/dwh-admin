package org.aktin.dwh.admin.log;

public enum FilterLevel {
	DEBUG(0),
	INFO(1),
	WARNING(2),
	ERROR(3);
	
	private FilterLevel(int level){
		this.level = level;
	}
	private int level;
	public int level(){
		return level;
	}
}
