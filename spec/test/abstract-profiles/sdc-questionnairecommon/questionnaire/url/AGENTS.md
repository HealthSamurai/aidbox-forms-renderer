## Element

```json
{
  "id": "Questionnaire.url",
  "path": "Questionnaire.url",
  "constraint": [
    {
      "key": "cnl-1",
      "severity": "warning",
      "human": "Warning\tQuestionnaire.url\tURL should not contain | or # - these characters make processing canonical references problematic",
      "expression": "exists() implies matches('^[^|# ]+$')",
      "xpath": "not(@value) or matches(@value, '^[^|# ]+$')",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnairecommon"
    }
  ]
}
```
