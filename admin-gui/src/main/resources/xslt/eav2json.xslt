<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

<xsl:output method="text"/>
<xsl:strip-space elements="*"/>
<xsl:template match="/">
{
		<xsl:apply-templates select="/e:eav-data/e:patient"/>
}
</xsl:template>

<xsl:template match="/e:eav-data/e:patient">
	patient_id: '<xsl:value-of select="@id"/>',
	gender: '<xsl:value-of select="e:gender"/>',
	birthdate: '<xsl:value-of select="e:birthdate"/>',
	encounter: {
		<xsl:apply-templates select="/e:eav-data/e:patient/e:encounter"/>
	}
</xsl:template>

<xsl:template match="/e:eav-data/e:patient/e:encounter">
		// Aufnahme
		start: '<xsl:value-of select="e:start"/>',
		// Entlassung
		end: '<xsl:value-of select="e:end"/>',
		facts: [
				<xsl:apply-templates select="/e:eav-data/e:patient/e:encounter/e:fact"/>
		]
</xsl:template>

<xsl:template match="e:fact">
			{
				concept: '<xsl:value-of select="@concept"/>',
				time: '<xsl:value-of select="@start"/>',
	<xsl:choose>		
		<xsl:when test="not(e:modifier)">
				content: {
					value: '<xsl:value-of select="e:value"/>', 
				<xsl:if test="e:value/@unit">
					unit: '<xsl:value-of select="e:value/@unit"/>',
				</xsl:if>
				<xsl:if test="e:value/@operator">
					operator: '<xsl:value-of select="e:value/@operator"/>',
				</xsl:if> 
				},
		</xsl:when>
		<xsl:otherwise>
				modifiers: [
			<xsl:for-each select="e:modifier">
					{
						code: '<xsl:value-of select="@code"/>',
						value: '<xsl:value-of select="e:value"/>',
					},
			</xsl:for-each>
				]
        </xsl:otherwise>
	</xsl:choose>
			},
</xsl:template>

</xsl:stylesheet>
