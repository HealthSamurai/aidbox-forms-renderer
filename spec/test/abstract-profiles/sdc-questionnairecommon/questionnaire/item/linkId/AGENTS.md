## Element

```json
{
  "id": "Questionnaire.item.linkId",
  "path": "Questionnaire.item.linkId",
  "constraint": [
    {
      "key": "que-15",
      "severity": "error",
      "human": "Link ids must be 255 characters or less",
      "expression": "$this.length() <= 255",
      "xpath": "string-length(@value) <= 255",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    }
  ],
  "mustSupport": true,
  "mapping": [{ "identity": "ihe-sdc", "map": "./section_identifier" }]
}
```
