<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >



	<xsl:template name="eav_complaint">
		<dt>Beschwerden und Ersteinschätzung</dt>
		<dd>
			<dl>
				<dt>Vorstellungsgrund (CEDIS)</dt>
				<dd>
					<xsl:apply-templates select="e:fact[starts-with(@concept,'CEDIS30:')]"/>
				</dd>

				<dt>Beschwerden bei Vorstellung</dt>
				<dd>
					<xsl:value-of select="e:fact[@concept='AKTIN:COMPLAINT']/e:value"/>
				</dd>

				<dt>Zeitpunkt der Vorstellung</dt>
				<dd>
					<xsl:value-of select="e:fact[@concept='AKTIN:COMPLAINT']/@start"/>
				</dd>

				<dt>Symptomdauer</dt>
				<dd>
					<xsl:apply-templates select="e:fact[@concept='AKTIN:SYMPTOMDURATION']"/>
				</dd>

				<dt>Ersteinschätzung</dt>
				<dd>
					<xsl:apply-templates select="e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]"/>
				</dd>

				<dt>Zeitpunkt der Ersteinschätzung</dt>
				<dd>
					<xsl:value-of select="e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]/@start"/>
				</dd>
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
	<xsl:template match="e:fact[@concept='MTS:5']">
		MTS Stufe 5 (nicht dringend, blau)
	</xsl:template>
	<xsl:template match="e:fact[@concept='MTS:4']">
		MTS Stufe 4 (normal, grün)
	</xsl:template>
	<xsl:template match="e:fact[@concept='MTS:3']">
		MTS Stufe 3 (dringend, gelb)
	</xsl:template>
	<xsl:template match="e:fact[@concept='MTS:2']">
		MTS Stufe 2 (sehr dringend, orange)
	</xsl:template>
	<xsl:template match="e:fact[@concept='MTS:1']">
		MTS Stufe 1 (sofort, rot)
	</xsl:template>
	<!-- ESI -->
	<xsl:template match="e:fact[@concept='ESI:5']">
		ESI Stufe 5 (Nonurgent - Stable, with no resources anticipated except oral or topical medications, or prescriptions)
	</xsl:template>
	<xsl:template match="e:fact[@concept='ESI:4']">
		ESI Stufe 4 (Less Urgent - Stable, with only one type of resource anticipated (such as only an X-ray, or only sutures))
	</xsl:template>
	<xsl:template match="e:fact[@concept='ESI:3']">
		ESI Stufe 3 (Urgent - Stable, with multiple types of resources needed to investigate or treat (such as lab tests plus X-ray imaging))
	</xsl:template>
	<xsl:template match="e:fact[@concept='ESI:2']">
		ESI Stufe 2 (Emergent - High risk of deterioration, or signs of a time-critical problem)
	</xsl:template>
	<xsl:template match="e:fact[@concept='ESI:1']">
		ESI Stufe 1 (Resuscitation - Immediate, life-saving intervention required without delay)
	</xsl:template>
	<!-- Sonstige -->
	<xsl:template match="e:fact[starts-with(@concept,'AKTIN:ASSESSMENT:')]">
		SONSTIGE Einschätzung: <xsl:value-of select="substring(@concept,18)"/>
	</xsl:template>
</xsl:stylesheet>