<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:e="http://sekmi.de/histream/ns/eav-data" >

	<xsl:template name="eav_baseinfo">
		<dt>Weitere Basisdaten</dt>
		<dd>
			<dl>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:PREGNANCY:')]">
					<dt>Schwangerschaft</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:PREGNANCY:')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'LOINC:11458-7')]">
					<dt>Tetanusschutz</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'LOINC:11458-7')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[@concept='AKTIN:ALLERGY:TXT']">
					<dt>Allergie Spezifizierung (Freitext)</dt>
					<dd>
						<xsl:value-of select="e:fact[@concept='AKTIN:ALLERGY:TXT']/e:value"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:ALGN')]">
					<dt>Allergien</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:ALGN')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:V08')]">
					<dt>Kontrastmittelallergie</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:V08')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:A07AA')]">
					<dt>Antibiotikaallergie</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:A07AA')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:OTH')]">
					<dt>Allergie Sonstige</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:OTH')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:ISOLATION:ISO')]">
					<dt>Isolation</dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:ISOLATION:ISO')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:ISOREASON:')]">
					<dt>Begründung der Isolation: </dt>
					<dd>
						<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:ISOREASON:')]"/>
					</dd>
				</xsl:if>
				<xsl:if test="e:fact[starts-with(@concept, 'AKTIN:PATHOGENE:')]">			
					<dt>Multiresistente Erreger</dt>
					<dd>
						<xsl:if test="e:fact[@concept='AKTIN:PATHOGENE:AMRO:NEG']">
							Nein
						</xsl:if>
						<xsl:if test="e:fact[not(@concept='AKTIN:PATHOGENE:AMRO:NEG')]">
							<dl>
								<xsl:apply-templates select="e:fact[starts-with(@concept, 'AKTIN:PATHOGENE:')]"/>
							</dl>
						</xsl:if>
					</dd>
				</xsl:if>
			</dl>
		</dd>
	</xsl:template>
	
	<!-- Schwangerschaft -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:PREGNANCY:')]">
		<xsl:if test="@concept='AKTIN:PREGNANCY:1'">
			Patient ist anamnestisch schwanger
		</xsl:if>
		<xsl:if test="@concept='AKTIN:PREGNANCY:0'">
			Patient ist anamnestisch nicht schwanger
		</xsl:if>
		<xsl:if test="@concept='AKTIN:PREGNANCY:UNK'">
			Information nicht erhebbar
		</xsl:if>
	</xsl:template>

	<!-- Tetanus -->
	<xsl:template match="e:fact[starts-with(@concept, 'LOINC:11458-7')]">
		<xsl:if test="@concept='LOINC:11458-7:NEG'">
			Patient hat keinen Tetanusschutz
		</xsl:if>
		<xsl:if test="@concept='LOINC:11458-7'">
			Patient hat Tetanusschutz, <xsl:value-of select="e:modifier/e:value"/>
		</xsl:if>
		<xsl:if test="@concept='LOINC:11458-7:NI'">
			Information nicht erhebbar
		</xsl:if>
	</xsl:template>

	<!-- Allergien -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:ALGN')]">
		<xsl:if test="@concept='AKTIN:ALLERGY:ALGN'">
			Ja
		</xsl:if>
		<xsl:if test="@concept='AKTIN:ALLERGY:ALGN:NEG'">
			Nein
		</xsl:if>
	</xsl:template>

	<!-- Kontrastmittelallergie -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:V08')]">
		<xsl:if test="@concept='AKTIN:ALLERGY:V08'">
			Ja
		</xsl:if>
		<xsl:if test="@concept='AKTIN:ALLERGY:V08:NEG'">
			Nein
		</xsl:if>
	</xsl:template>

	<!-- Antibiotikaallergie -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:A07AA')]">
		<xsl:if test="@concept='AKTIN:ALLERGY:A07AA'">
			Ja
		</xsl:if>
		<xsl:if test="@concept='AKTIN:ALLERGY:A07AA:NEG'">
			Nein
		</xsl:if>
	</xsl:template>

	<!-- sonstige Allergien -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:ALLERGY:OTH')]">
		<xsl:if test="@concept='AKTIN:ALLERGY:OTH'">
			Ja
		</xsl:if>
		<xsl:if test="@concept='AKTIN:ALLERGY:OTH:NEG'">
			Nein
		</xsl:if>
	</xsl:template>

	<!-- Isolation -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:ISOLATION:')]">
		<xsl:if test="@concept='AKTIN:ISOLATION:ISO'">
			Patient muss isoliert werden
		</xsl:if>
		<xsl:if test="@concept='AKTIN:ISOLATION:RISO'">
			Umkehrisolierung
		</xsl:if>
		<xsl:if test="@concept='AKTIN:ISOLATION:ISO:NEG'">
			Patient muss nicht isoliert werden
		</xsl:if>
	</xsl:template>

	<!-- Begründung der Isolation -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:ISOREASON:')]">
		<xsl:if test="@concept='AKTIN:ISOREASON:U80'">
			multiresistenter Keim
		</xsl:if>
		<xsl:if test="e:fact[@concept=' AKTIN:ISOREASON:A09.9']">
			Gastroenteritis
		</xsl:if>
		<xsl:if test="e:fact[@concept=' AKTIN:ISOREASON:A16.9']">
			Tuberkulose
		</xsl:if>
		<xsl:if test="e:fact[@concept=' AKTIN:ISOREASON:G03.9']">
			Meningitis
		</xsl:if>
		<xsl:if test="e:fact[@concept=' AKTIN:ISOREASON:OTH']">
			Andere
		</xsl:if>
	</xsl:template>

	<!-- Multiresistente Erreger -->
	<xsl:template match="e:fact[starts-with(@concept, 'AKTIN:PATHOGENE:')]">
		<dt>
			<xsl:if test="starts-with(@concept, 'AKTIN:PATHOGENE:MRSA')">
				Erregertyp: MRSA
			</xsl:if>
			<xsl:if test="starts-with(@concept, 'AKTIN:PATHOGENE:3MRGN')">
				Erregertyp: 3-MRGN
			</xsl:if>
			<xsl:if test="starts-with(@concept, 'AKTIN:PATHOGENE:4MRGN')">
				Erregertyp: 4-MRGN
			</xsl:if>
			<xsl:if test="starts-with(@concept, 'AKTIN:PATHOGENE:VRE')">
				Erregertyp: VRE
			</xsl:if>
			<xsl:if test="starts-with(@concept, 'AKTIN:PATHOGENE:OTH')">
				Erregertyp: Andere
			</xsl:if>
		</dt>

		<dd>
			<xsl:if test="contains(@concept, 'SUSP')">
				Verdacht
			</xsl:if>
			<xsl:if test="not(contains(@concept, 'SUSP'))">
				Ja
			</xsl:if>
		</dd>
	</xsl:template>
</xsl:stylesheet>
