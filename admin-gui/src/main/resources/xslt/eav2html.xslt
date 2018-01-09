<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	version="1.0">

<xsl:template match="/">
	<html>
		<body>
			<xsl:apply-templates select="/eav-data/patient"/>
		</body>
	</html>
</xsl:template>

<xsl:template match="/eav-data/patient">
	PatientId: <xsl:value-of select="@id"/>
	<br />
	Geschlecht: <xsl:value-of select="gender"/>
	<br />
	Geburtsdatum: <xsl:value-of select="birthdate"/>
	<br />
	<xsl:apply-templates select="/eav-data/patient/encounter"/>
</xsl:template>

<xsl:template match="/eav-data/patient/encounter">
	Aufnahme: <xsl:value-of select="start"/>
	<br />
	Entlassung: <xsl:value-of select="end"/>
	<br />
	<table class="eav-fact-table" border="1" >
		<tr bgcolor="#9acd32">
			<th>concept</th>
			<th>time</th>
			<th>value</th>
		</tr>
		<xsl:apply-templates select="/eav-data/patient/encounter/fact"/>
	</table>
</xsl:template>

<xsl:template match="fact">
	<tr class="eav-fact-row">
		<td><xsl:value-of select="@concept"/></td>
		<td><xsl:value-of select="@start"/></td>
		<td>
			<ul>
				<xsl:choose>
					<xsl:when test="not(modifier)">
						<li>
							<xsl:value-of select="value"/> 
							<xsl:if test="value/@unit">
								[<xsl:value-of select="value/@unit"/>]
							</xsl:if>
							<xsl:if test="value/@operator">
								(Operator: <xsl:value-of select="value/@operator"/>) 
							</xsl:if> 
						</li>
					</xsl:when>
					<xsl:otherwise>
						<xsl:for-each select="modifier">
							<li>
								<xsl:value-of select="@code"/>: <xsl:value-of select="value"/>
							</li>
						</xsl:for-each>
			        </xsl:otherwise>
				</xsl:choose>
			</ul>
		</td>
	</tr>
</xsl:template>

</xsl:stylesheet>
