## Element

```json
{
  "id": "Questionnaire.item.answerOption.value[x]:valueCoding",
  "path": "Questionnaire.item.answerOption.value[x]",
  "sliceName": "valueCoding",
  "min": 0,
  "max": "1",
  "type": [{ "code": "Coding" }],
  "constraint": [
    {
      "key": "sdc-base-1",
      "severity": "error",
      "human": "AnswerOption.valueCoding must have at least one of code or display",
      "expression": "code.exists() or display.exists()",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire"
    },
    {
      "key": "sdc-base-2",
      "severity": "error",
      "human": "If code exists, system must exist",
      "expression": "code.exists() implies system.exists()",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire"
    }
  ]
}
```
