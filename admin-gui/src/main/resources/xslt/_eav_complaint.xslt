<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >



	<xsl:template name="eav_complaint">
		<dt>Beschwerden und Ersteinschätzung</dt>
		<dd>
			<dl>
				<xsl:if test="e:fact[starts-with(@concept, 'CEDIS30:')]">
					<dt>Vorstellungsgrund (CEDIS)</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'CEDIS30:')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[@concept='AKTIN:COMPLAINT']">
					<dt>Beschwerden bei Vorstellung</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='AKTIN:COMPLAINT']/e:value"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[@concept='AKTIN:COMPLAINT']/@start">
					<dt>Zeitpunkt der Vorstellung</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='AKTIN:COMPLAINT']/@start"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[@concept='AKTIN:SYMPTOMDURATION']">
					<dt>Symptomdauer</dt>
					<dd>
						<xsl:apply-templates select="e:fact[@concept='AKTIN:SYMPTOMDURATION']"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]">
					<dt>Ersteinschätzung</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]/@start">
					<dt>Zeitpunkt der Ersteinschätzung</dt>
					<dd>
						<xsl:value-of select="e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]/@start"/>
					</dd>
				</xsl:if>
			</dl>
		</dd>
	</xsl:template>
	
	<!-- Symptomdauer -->
	<xsl:template match="e:fact[@concept='AKTIN:SYMPTOMDURATION']">
		<xsl:value-of select="e:value"/> <xsl:value-of select="e:value/@unit"/> 
	</xsl:template>
	<xsl:template match="e:fact[starts-with(@concept,'CEDIS30:')]">
		<xsl:value-of select="substring(@concept,9)"/>
		- 
		<xsl:value-of select="e:modifier[@code='displayName']/e:value"/>
	</xsl:template>


	<!-- Triage -->
	<!-- MTS -->
	<xsl:template match="e:fact[starts-with(@concept,'MTS:')]">
		<xsl:if test="@concept='MTS:5'">
			MTS Stufe 5 (nicht dringend, blau)
		</xsl:if>
		<xsl:if test="@concept='MTS:4'">
			MTS Stufe 4 (normal, grün)
		</xsl:if>
		<xsl:if test="@concept='MTS:3'">
			MTS Stufe 3 (dringend, gelb)
		</xsl:if>
		<xsl:if test="@concept='MTS:2'">
			MTS Stufe 2 (sehr dringend, orange)
		</xsl:if>
		<xsl:if test="@concept='MTS:1'">
			MTS Stufe 1 (sofort, rot)
		</xsl:if>
	</xsl:template>
	<!-- ESI -->
	<xsl:template match="e:fact[starts-with(@concept,'ESI:')]">
		<xsl:if test="@concept='ESI:5'">
			ESI Stufe 5 (Nonurgent - Stable, with no resources anticipated except oral or topical medications, or prescriptions)
		</xsl:if>
		<xsl:if test="@concept='ESI:4'">
			ESI Stufe 4 (Less Urgent - Stable, with only one type of resource anticipated (such as only an X-ray, or only sutures))
		</xsl:if>
		<xsl:if test="@concept='ESI:3'">
			ESI Stufe 3 (Urgent - Stable, with multiple types of resources needed to investigate or treat (such as lab tests plus X-ray imaging))
		</xsl:if>
		<xsl:if test="@concept='ESI:2'">
			ESI Stufe 2 (Emergent - High risk of deterioration, or signs of a time-critical problem)
		</xsl:if>
		<xsl:if test="@concept='ESI:1'">
			ESI Stufe 1 (Resuscitation - Immediate, life-saving intervention required without delay)
		</xsl:if>
	</xsl:template>
	<!-- Sonstige -->
	<xsl:template match="e:fact[starts-with(@concept,'AKTIN:ASSESSMENT:')]">
		SONSTIGE Einschätzung: <xsl:value-of select="substring(@concept,18)"/>
	</xsl:template>
</xsl:stylesheet>