<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">

<xsl:output method="text"/>
<xsl:strip-space elements="*"/>
<xsl:template match="/">
{
		<xsl:apply-templates select="/eav-data/patient"/>
}
</xsl:template>

<xsl:template match="/eav-data/patient">
	patient_id: '<xsl:value-of select="@id"/>',
	gender: '<xsl:value-of select="gender"/>',
	birthdate: '<xsl:value-of select="birthdate"/>',
	encounter: {
		<xsl:apply-templates select="/eav-data/patient/encounter"/>
	}
</xsl:template>

<xsl:template match="/eav-data/patient/encounter">
		// Aufnahme
		start: '<xsl:value-of select="start"/>',
		// Entlassung
		end: '<xsl:value-of select="end"/>',
		facts: [
				<xsl:apply-templates select="/eav-data/patient/encounter/fact"/>
		]
</xsl:template>

<xsl:template match="fact">
			{
				concept: '<xsl:value-of select="@concept"/>',
				time: '<xsl:value-of select="@start"/>',
	<xsl:choose>		
		<xsl:when test="not(modifier)">
				content: {
					value: '<xsl:value-of select="value"/>', 
				<xsl:if test="value/@unit">
					unit: '<xsl:value-of select="value/@unit"/>',
				</xsl:if>
				<xsl:if test="value/@operator">
					operator: '<xsl:value-of select="value/@operator"/>',
				</xsl:if> 
				},
		</xsl:when>
		<xsl:otherwise>
				modifiers: [
			<xsl:for-each select="modifier">
					{
						code: '<xsl:value-of select="@code"/>',
						value: '<xsl:value-of select="value"/>',
					},
			</xsl:for-each>
				]
        </xsl:otherwise>
	</xsl:choose>
			},
</xsl:template>

</xsl:stylesheet>
