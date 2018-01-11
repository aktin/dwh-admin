<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_modules">
		<dt>Zusatzmodule</dt>
		<dd>
			<dl>
				<xsl:if test="e:fact[@concept='LOINC:53576-5']">
					<dt>Modul Überwachung</dt>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:74198-3']">
					<dt>Modul Trauma</dt>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:34905-0']">
					<dt>Modul Neurologie</dt>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:11488-4']">
					<dt>Modul Konsil</dt>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:34750-0']">
					<dt>Modul Anästhesie</dt>
				</xsl:if>
			</dl>
		</dd>
	</xsl:template>
</xsl:stylesheet>
