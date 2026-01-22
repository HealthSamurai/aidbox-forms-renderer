## Element

```json
{
  "id": "Questionnaire",
  "path": "Questionnaire",
  "constraint": [
    {
      "key": "cnl-0",
      "severity": "warning",
      "human": "Name should be usable as an identifier for the module by machine processing applications such as code generation",
      "expression": "name.exists() implies name.matches('^[A-Z]([A-Za-z0-9_]){1,254}$')",
      "xpath": "not(f:name) or matches(f:name/@value, '^[A-Z]([A-Za-z0-9_]){1,254}$')",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    },
    {
      "key": "sdc-2",
      "severity": "error",
      "human": "If version is present, versionAlgorithm must be present.",
      "expression": "version.exists() implies extension.where(url='http://hl7.org/fhir/5.0/StructureDefinition/extension-Questionnaire.versionAlgorithm[x]').exists()",
      "xpath": "not(exists(f:version)) or exists(f:extension[@url='http://hl7.org/fhir/5.0/StructureDefinition/extension-Questionnaire.versionAlgorithm[x]'])",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    },
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bestpractice",
          "valueBoolean": true
        }
      ],
      "key": "sdc-3",
      "severity": "warning",
      "human": "Semver is the preferred version algorithm - package machinery doesn't work well with artifacts using alternate versioning schemes",
      "expression": "extension.where(url='http://hl7.org/fhir/5.0/StructureDefinition/extension-Questionnaire.versionAlgorithm[x]').all(value.ofType(Coding).where(system='http://hl7.org/fhir/version-algorithm' and code='semver').exists())",
      "xpath": "not(f:extension[@url='http://hl7.org/fhir/5.0/StructureDefinition/extension-Questionnaire.versionAlgorithm[x]' and not(exists(f:valueCoding[f:system/@value='http://hl7.org/fhir/version-algorithm' and f:code/@value='semver'])))",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    }
  ],
  "mapping": [{ "identity": "ihe-sdc", "map": "Form_Package" }]
}
```
