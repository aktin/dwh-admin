<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_admission">
		<dt>Aufnahme und Zuweisung</dt>
		<dd>
			<dl>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:REFERRAL:')]">
					<dt>Zuweisung/Einweiser</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'AKTIN:REFERRAL:')]"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:TRANSPORT:')]">
					<dt>Transportmittel</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'AKTIN:TRANSPORT:')]"/>
					</dd>
				</xsl:if>
			</dl>
		</dd>
	</xsl:template>
	
	<!-- Zuweisung -->
	<xsl:template match="e:fact[starts-with(@concept,'AKTIN:REFERRAL:')]">
		<xsl:if test="@concept='AKTIN:REFERRAL:VAP'">
			Vertragsarzt/Praxis
		</xsl:if>
		<xsl:if test="@concept='AKTIN:REFERRAL:KVNPIK'">
			KV-Notfallpraxis am Krankenhaus
		</xsl:if>
		<xsl:if test="@concept='AKTIN:REFERRAL:KVNDAK'">
			KV-Notdienst außerhalb des Krankenhauses
		</xsl:if>
		<xsl:if test="@concept='AKTIN:REFERRAL:RD'">
			Rettungsdienst
		</xsl:if>
		<xsl:if test="@concept='AKTIN:REFERRAL:NA'">
			Notarzt
		</xsl:if>
		<xsl:if test="@concept='AKTIN:REFERRAL:KLINV'">
			Klinik/Verlegung
		</xsl:if>
		<xsl:if test="@concept='AKTIN:REFERRAL:NPHYS'">
			Zuweisung nicht durch Arzt
		</xsl:if>
		<xsl:if test="@concept='AKTIN:REFERRAL:OTH'">
			Andere
		</xsl:if>
	</xsl:template>
	
	<!-- Transport -->
	<xsl:template match="e:fact[starts-with(@concept,'AKTIN:TRANSPORT:')]">
		<xsl:if test="@concept='AKTIN:TRANSPORT:NA'">
			Ohne
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSPORT:1'">
			KTW
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSPORT:2'">
			RTW
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSPORT:3'">
			NAW/NEF/ITW
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSPORT:4'">
			RTH/ITH
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSPORT:OTH'">
			Andere
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>