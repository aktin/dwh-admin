<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_insurance">
		<dt>Krankenversicherung</dt>
		<dd>
			<dl>

				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:TRANSPORT:')]">
					<dt>Versicherungsträger</dt>
					<dd><xsl:value-of select="e:fact[@concept='AKTIN:KKNAME']/e:value"/></dd>
				</xsl:if>

				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:TRANSPORT:')]">
					<dt>Versicherungsnummer</dt>
					<dd><xsl:value-of select="e:fact[@concept='AKTIN:IKNR']/e:value"/></dd>
				</xsl:if>
				<!-- <dt>VKNR</dt>
				<dd><xsl:value-of select="e:fact[@concept='AKTIN:VKNR']/e:value"/></dd> -->
			</dl>
		</dd>
	</xsl:template>
</xsl:stylesheet>