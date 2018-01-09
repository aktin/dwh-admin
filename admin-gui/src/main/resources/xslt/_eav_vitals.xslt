<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_vitals">
		<dt>Vitalparameter und Scores</dt>
		<dd>
			<dl>
				<xsl:if test="e:fact[@concept='LOINC:9279-1']">
					<dt>Atemfrequenz</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='LOINC:9279-1']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:20564-1']">
					<dt>Sauerstoffsättigung</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='LOINC:20564-1']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:8480-6']">
					<dt>Systolischer Blutdruck</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='LOINC:8480-6']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:8867-4']">
					<dt>Herzfrequenz</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='LOINC:8867-4']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:8329-5']">
					<dt>Körperkerntemperatur</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='LOINC:8329-5']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:72514-3']">
					<dt>Schmerzskala</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='LOINC:72514-3']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:9269-2']">
					<dt>Glasgow Coma Scale (GCS) Summe</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='LOINC:9269-2']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:9267-6']">
					<dt>GCS Augenöffnen</dt>
					<dd>TODO
						<xsl:apply-templates select="e:fact[@concept='LOINC:9267-6']"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:9270-0']">
					<dt>GCS verbale Antwort</dt>
					<dd>TODO
						<xsl:apply-templates select="e:fact[@concept='LOINC:9270-0']"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:9268-4']">
					<dt>GCS motorische Antwort</dt>
					<dd>TODO
						<xsl:apply-templates select="e:fact[@concept='LOINC:9268-4']"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept,'AKTIN:SPPL:')]">
					<dt>Pupillenweite</dt>
					<dd>
						<!-- <xsl:value-of select="e:modifier[@code='AKTIN:TSITE:R']"/> -->
						<!-- <xsl:value-of select="@concept"/> -->
						TODO
						<!-- <xsl:apply-templates select="e:fact[starts-with(@concept,'AKTIN:SPPL:')]/e:modifier[@code='AKTIN:TSITE:R']"/> -->
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept,'AKTIN:RPPL:')]">
					<dt>Pupillenreaktion</dt>
					<dd>TODO
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept,'RANKIN:')]">
					<dt>Rankin</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'RANKIN:')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='LOINC:75859-9']">
					<dt>Rankin-Skala (LOINC:75859-9)</dt>
					<dd>
						Rankin <xsl:value-of select="e:fact[@concept='LOINC:75859-9']/e:value"/>
					</dd>
				</xsl:if>
			</dl>
		</dd>
	</xsl:template>
</xsl:stylesheet>