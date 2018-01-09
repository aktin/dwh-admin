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
			</dl>
		</dd>

	</xsl:template>
</xsl:stylesheet>