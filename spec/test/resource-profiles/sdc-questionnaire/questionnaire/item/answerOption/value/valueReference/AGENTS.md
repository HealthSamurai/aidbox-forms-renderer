## Element

```json
{
  "id": "Questionnaire.item.answerOption.value[x]:valueReference",
  "path": "Questionnaire.item.answerOption.value[x]",
  "sliceName": "valueReference",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Reference",
      "targetProfile": ["http://hl7.org/fhir/StructureDefinition/Resource"]
    }
  ],
  "constraint": [
    {
      "key": "sdc-base-4",
      "severity": "error",
      "human": "Reference must have at least one of reference, display, and identifier",
      "expression": "reference.exists() or display.exists() or identifier.exists()",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire"
    }
  ]
}
```
