<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_metadata">

		<dt>Metainfos</dt>
		<dd>
			<dl>
				<dt>Dokumenten Id</dt>
				<dd>
					<xsl:value-of select="e:encounter/@id"/>
				</dd>

				<xsl:if test="e:encounter/e:fact[@concept='AKTIN:Fallkennzeichen']/e:value">
					<dt>Fallkennzeichen</dt>
					<dd>
						<xsl:value-of select="e:encounter/e:fact[@concept='AKTIN:Fallkennzeichen']/e:value"/>
					</dd>
				</xsl:if>

				<dt>Patienten Id</dt>
				<dd>
					<xsl:value-of select="@id"/>
				</dd>

				<dt>Aufnahmezeitpunkt</dt>
				<dd>
					<xsl:value-of select="e:encounter/e:start"/>
				</dd>

				<xsl:if test="e:encounter/e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]/@start">
					<dt>Zeitpunkt der Ersteinschätzung</dt>
					<dd>
						<xsl:value-of select="e:encounter/e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]/@start"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:encounter/e:fact[@concept='AKTIN:PHYSENCOUNTER']/@start">
					<dt>Erster Arztkontakt</dt>
					<dd>
						<xsl:value-of select="e:encounter/e:fact[@concept='AKTIN:PHYSENCOUNTER']/@start"/>
					</dd>
				</xsl:if>

				<xsl:if test="e:encounter/e:fact[@concept='AKTIN:STARTTHERAPY']/@start">
					<dt>Beginn der Therapie</dt>
					<dd>
						<xsl:value-of select="e:encounter/e:fact[@concept='AKTIN:STARTTHERAPY']/@start"/>
					</dd>
				</xsl:if>

				<dt>Entlass-/Verlgungzeitpunkt</dt>
				<dd>
					<xsl:value-of select="e:encounter/e:end"/>
				</dd>
			</dl>
		</dd>

	</xsl:template>
</xsl:stylesheet>