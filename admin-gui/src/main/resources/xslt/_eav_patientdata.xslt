<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_patientdata">


		<dt>Patientendaten</dt>
		<dd>
			<dl>
				<dt>Geschlecht</dt>
				<dd><xsl:value-of select="e:gender"/></dd>
				
				<dt>Geburtsdatum</dt>
				<dd><xsl:value-of select="e:birthdate"/></dd>

				<dt>Wohnort/Postleitzahl</dt>
				<dd>
					<xsl:value-of select="e:encounter/e:fact[@concept='AKTIN:ZIPCODE']/e:value"/>
				</dd>
			</dl>
		</dd>

	</xsl:template>
</xsl:stylesheet>