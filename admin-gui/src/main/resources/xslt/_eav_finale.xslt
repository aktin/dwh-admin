<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_finale">
		<dt>Abschluss / weiteres Vorgehen</dt>
		<dd>
			<dl>
				<dt>Führende Abschlussdiagnose</dt>
				<dd>
					<dl>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'ICD10GM:') and e:modifier[@code='AKTIN:DIAG:F']]"/>
					</dl>
				</dd>
				<dt>Weitere Abschlussdiagnosen</dt>
				<dd>
					<dl>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'ICD10GM:') and not(e:modifier[@code='AKTIN:DIAG:F'])]"/>
					</dl>
				</dd>
				<xsl:if test="e:fact[starts-with(@concept,'AKTIN:TRANSFER:')]">
					<dt>Verlegungsart</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'AKTIN:TRANSFER:')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept,'AKTIN:DISCHARGE:')]">
					<dt>Entlassungsart</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept,'AKTIN:DISCHARGE:')]"/>
					</dd>
				</xsl:if>
			</dl>
		</dd>
	</xsl:template>
	
	<!-- Abschlussdiagnosen -->
	<xsl:template match="e:fact[starts-with(@concept,'ICD10GM:')]">
		<dt><xsl:value-of select="substring(@concept,9)"/></dt>
		<xsl:apply-templates select="e:modifier[starts-with(@code,'AKTIN:DIAG:')]"/>
		<xsl:if test="e:modifier[@code='originalText']">
			<dd>Freitext<dd><xsl:value-of select="e:modifier[@code='originalText']/e:value"/></dd></dd>
		</xsl:if>
	</xsl:template>
	<xsl:template match="e:fact[starts-with(@concept,'ICD10GM:')]/e:modifier[starts-with(@code,'AKTIN:DIAG:')]">
		<!-- <xsl:if test="@code='AKTIN:DIAG:F'">
			<dd>Führende Diagnose</dd>
		</xsl:if> -->
		<xsl:if test="not(@code='AKTIN:DIAG:F')">
			<dd>Zusatzkennzeichen: <xsl:value-of select="substring(@code,12)"/></dd>
		</xsl:if>
	</xsl:template>

	<!-- Verlegung -->
	<xsl:template match="e:fact[starts-with(@concept,'AKTIN:TRANSFER:')]">
		<xsl:if test="@concept='AKTIN:TRANSFER:1'">
			intern: OP / Intervention (z.B. Herzkatheter, Endoskopie, ...)
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSFER:2'">
			extern: OP / Intervention (z.B. Herzkatheter, Endoskopie, ...)
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSFER:3'">
			intern: Überwachung (ICU / IMC / Chest-Pain-Unit / Stroke)
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSFER:4'">
			extern: Überwachung (ICU / IMC / Chest-Pain-Unit / Stroke)
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSFER:5'">
			intern: Normalstation
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSFER:6'">
			extern: Normalstation
		</xsl:if>
		<xsl:if test="@concept='AKTIN:TRANSFER:OTH'">
			Sonstiges
		</xsl:if>
	</xsl:template>

	<!-- Entlassung -->
	<xsl:template match="e:fact[starts-with(@concept,'AKTIN:DISCHARGE:')]">
		<xsl:if test="@concept='AKTIN:DISCHARGE:1'">
			Tod
		</xsl:if>
		<xsl:if test="@concept='AKTIN:DISCHARGE:2'">
			Entlassung gegen ärztlichen Rat
		</xsl:if>
		<xsl:if test="@concept='AKTIN:DISCHARGE:3'">
			Behandlung durch Pat. abgebrochen
		</xsl:if>
		<xsl:if test="@concept='AKTIN:DISCHARGE:4'">
			Entlassung nach Hause
		</xsl:if>
		<xsl:if test="@concept='AKTIN:DISCHARGE:5'">
			Entlassung zu weiterbehandelnden Arzt
		</xsl:if>
		<xsl:if test="@concept='AKTIN:DISCHARGE:6'">
			kein Arztkontakt
		</xsl:if>
		<xsl:if test="@concept='AKTIN:DISCHARGE:OTH'">
			Sonstige Entlassung
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>