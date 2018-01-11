<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_diagnosis">
		<dt>Diagnostik</dt>
		<dd>
			<dl>				
				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:26436-6')]">
					<dt>Labor</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:26436-6')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:18767-4')]">
					<dt>Blutgasanalyse</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:18767-4')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:50556-0')]">
					<dt>Urinschnelltest</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:50556-0')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:34534-8')]">
					<dt>EKG</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:34534-8')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:25061-3')]">
					<dt>Sonographie </dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:25061-3')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:42148-7')]">
					<dt>Echokardiographie</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:42148-7')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:24725-4')]">
					<dt>CCT</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:24725-4')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:25045-6')]">
					<dt>CT</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:25045-6')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:46305-9')]">
					<dt>Traumascan</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:46305-9')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:38008-9')]">
					<dt>Röntgen Wirbelsäule </dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:38008-9')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:30745-4')]">
					<dt>Röntgen Thorax</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:30745-4')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:28561-9')]">
					<dt>Röntgen Becken</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:28561-9')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:37637-6')]">
					<dt>Röntgen Extremitäten</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:37637-6')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:43468-8')]">
					<dt>Röntgen Sonstiges</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:43468-8')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:25056-3')]">
					<dt>MRT</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:25056-3')]"/>
					</dd>
				</xsl:if>
			</dl>
		</dd>
	</xsl:template>
		
	<xsl:template match="e:fact[starts-with(@concept, 'LOINC:26436-6') or starts-with(@concept, 'LOINC:18767-4') or starts-with(@concept, 'LOINC:50556-0') or starts-with(@concept, 'LOINC:34534-8') or starts-with(@concept, 'LOINC:25061-3') or starts-with(@concept, 'LOINC:42148-7') or starts-with(@concept, 'LOINC:24725-4') or starts-with(@concept, 'LOINC:25045-6') or starts-with(@concept, 'LOINC:46305-9') or starts-with(@concept, 'LOINC:38008-9') or starts-with(@concept, 'LOINC:30745-4') or starts-with(@concept, 'LOINC:28561-9') or starts-with(@concept, 'LOINC:37637-6') or starts-with(@concept, 'LOINC:43468-8') or starts-with(@concept, 'LOINC:25056-3')]">
		<dl>
			<dt><xsl:value-of select="@concept"/></dt>
			<xsl:if test="contains(@concept,'NEG')">
				<dd>Nicht durchgeführt</dd>
			</xsl:if> 
			<xsl:if test="not(contains(@concept,'NEG'))">
				<dd>durchgeführt</dd>
				<dt>Zeitpunkt der durchführung: </dt>
				<dd><xsl:value-of select="e:modifier[@code='effectiveTime']/e:value"/>
				</dd>
				<dt>Ergebnis: </dt>
				<dd> <xsl:if test="e:modifier[contains(@code,'OPB')]">Ohne </xsl:if> klinisch relevanter pathologischer Befund </dd>
			
			</xsl:if> 
		</dl>
	</xsl:template>


</xsl:stylesheet>
