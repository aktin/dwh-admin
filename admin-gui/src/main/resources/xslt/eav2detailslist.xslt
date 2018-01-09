<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:include href="_eav_metadata.xslt"/>
	<xsl:include href="_eav_patientdata.xslt"/>
	<xsl:include href="_eav_insurance.xslt"/>
	<xsl:include href="_eav_admission.xslt"/>
	<xsl:include href="_eav_complaint.xslt"/>
	<xsl:include href="_eav_vitals.xslt"/>

	<xsl:template match="/">
		<html>
			<body>
				<dl>
					<xsl:apply-templates select="/e:eav-data/e:patient"/>
				</dl>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="e:eav-data/e:patient">
		<xsl:call-template name="eav_metadata"/>
		<xsl:call-template name="eav_patientdata"/>
		<xsl:apply-templates select="e:encounter"/>
		<!-- TODO call other blocks -->
	</xsl:template>

	<xsl:template match="e:encounter">
		<xsl:call-template name="eav_insurance"/>
		<xsl:call-template name="eav_admission"/>
		<xsl:call-template name="eav_complaint"/>
		<xsl:call-template name="eav_vitals"/>
		<!-- TODO call other blocks -->
	</xsl:template>

	


	<!-- ... more blocks ... -->

</xsl:stylesheet>