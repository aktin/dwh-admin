<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_metadata">

		<dt>Metainfos</dt>
		<dd>
			<dl>
				<dt>Dokumenten Id</dt>
				<dd><xsl:value-of select="e:encounter/@id"/></dd>

				<dt>Fallkennzeichen</dt>
				<dd>
					<xsl:value-of select="e:encounter/e:fact[@concept='AKTIN:Fallkennzeichen']/e:value"/>
				</dd>

				<dt>Patienten Id</dt>
				<dd><xsl:value-of select="@id"/></dd>

				<dt>Aufnahmezeitpunkt</dt>
				<dd><xsl:value-of select="e:encounter/e:start"/></dd>

				<dt>Zeitpunkt der Ersteinschätzung</dt>
				<dd>
					<xsl:value-of select="e:encounter/e:fact[starts-with(@concept,'MTS:') or starts-with(@concept,'ESI:') or starts-with(@concept,'AKTIN:ASSESSMENT:')]/@start"/>
				</dd>

				<dt>Erster Arztkontakt</dt>
				<dd><xsl:value-of select="e:encounter/e:fact[@concept='AKTIN:PHYSENCOUNTER']/@start"/></dd>

				<dt>Beginn der Therapie</dt>
				<dd><xsl:value-of select="e:encounter/e:fact[@concept='AKTIN:STARTTHERAPY']/@start"/></dd>

				<dt>Entlass-/Verlgungzeitpunkt</dt>
				<dd><xsl:value-of select="e:encounter/e:end"/></dd>
			</dl>
		</dd>

	</xsl:template>
</xsl:stylesheet>