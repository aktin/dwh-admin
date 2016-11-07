package org.aktin.dwh.admin.log;

import java.util.function.Supplier;

public interface LogLineSupplierFactory {

	Supplier<String> readLogfile();
}
