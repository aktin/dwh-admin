<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >
	<xsl:template match="/">
		<html>
			<body>
				<dl>
					<dt>Geschlecht</dt>
					<dd><xsl:value-of select="/e:eav-data/e:patient/e:gender"/></dd>
					
					<dt>Geburtsdatum</dt>
					<dd><xsl:value-of select="/e:eav-data/e:patient/e:birthdate"/></dd>


					<xsl:apply-templates select="/e:eav-data/e:patient/e:encounter"/>

				</dl>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="e:encounter">
		<xsl:call-template name="block1"/>
		<xsl:call-template name="block2"/>
		<xsl:call-template name="block3"/>
		<!-- TODO call other blocks -->
	</xsl:template>

	<xsl:template name="block1">
		<dt>Aufnahme und Zuweisung</dt>
		<dd>
			<dl>
				<dt>Zuweisung/Einweiser</dt>
				<dd>
					<xsl:apply-templates select="e:fact[starts-with(@concept,'AKTIN:REFERRAL:')]"/>
				</dd>

				<dt>Transportmittel</dt>
				<dd>
					<xsl:apply-templates select="e:fact[starts-with(@concept,'AKTIN:TRANSPORT:')]"/>
				</dd>
			</dl>
		</dd>
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:VAP']">
		Vertragsarzt/Praxis
	</xsl:template>

	<!-- TODO more referral templates -->
	<xsl:template match="e:fact[@concept='AKTIN:TRANSPORT:NA']">
		Sonstige
	</xsl:template>
	

	<xsl:template name="block2">
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

				<dt>Symptomdauer</dt>
				<dd>
					<xsl:apply-templates select="e:fact[@concept='AKTIN:SYMPTOMDURATION']"/>
				</dd>

				<dt>Ersteinschätzung</dt>
				<dd>
					<xsl:apply-templates select="e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:')]"/>
				</dd>
			</dl>
		</dd>
	</xsl:template>
	
	<xsl:template match="e:fact[@concept='AKTIN:SYMPTOMDURATION']">
		<xsl:value-of select="e:value"/> <xsl:value-of select="e:value/@unit"/> 
	</xsl:template>
	<xsl:template match="e:fact[starts-with(@concept,'CEDIS30:')]">
		<xsl:value-of select="substring(@concept,9)"/>
		- 
		<xsl:value-of select="e:modifier[@code='displayName']/e:value"/>
	</xsl:template>
	<xsl:template match="e:fact[@concept='MTS:5']">
		MTS Stufe 5 (blau)
	</xsl:template>
	<xsl:template match="e:fact[@concept='MTS:4']">
		MTS Stufe 4 (grün)
	</xsl:template>
	<!-- TODO remaining MTS and ESI templates -->

	<xsl:template name="block3">
		<dt>Vitalparameter und Scores</dt>
		<dd>
			<dl>
				<dt>Atemfrequenz</dt>
				<dd>
					<xsl:value-of select="e:fact[@concept='LOINC:9279-1']/e:value"/>
				</dd>
				<!-- ... -->

			</dl>
		</dd>
	</xsl:template>

	<!-- ... more blocks ... -->

</xsl:stylesheet>