<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_admission">
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
	
	<!-- Zuweisung -->
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:VAP']">
		Vertragsarzt/Praxis
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:VAP']">
		KV-Notfallpraxis am Krankenhaus
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:KVNDAK']">
		KV-Notdienst außerhalb des Krankenhauses
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:RD']">
		Rettungsdienst
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:NA']">
		Notarzt
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:KLINV']">
		Klinik/Verlegung
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:NPHYS']">
		Zuweisung nicht durch Arzt
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:REFERRAL:OTH']">
		Andere
	</xsl:template>

	<!-- TODO more referral templates -->
	<xsl:template match="e:fact[@concept='AKTIN:TRANSPORT:NA']">
		Ohne
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:TRANSPORT:1']">
		KTW
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:TRANSPORT:2']">
		RTW
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:TRANSPORT:3']">
		NAW/NEF/ITW
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:TRANSPORT:4']">
		RTH/ITH
	</xsl:template>
	<xsl:template match="e:fact[@concept='AKTIN:TRANSPORT:OTH']">
		Andere
	</xsl:template>
</xsl:stylesheet>