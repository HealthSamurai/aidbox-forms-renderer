## Element

```json
{
  "id": "QuestionnaireResponse.item",
  "path": "QuestionnaireResponse.item",
  "constraint": [
    {
      "key": "qrs-2",
      "severity": "error",
      "human": "Repeated answers are combined in the answers array of a single item",
      "expression": "repeat(answer|item).select(item.where(answer.value.exists()).linkId.isDistinct()).allTrue()",
      "xpath": "true()",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponsecommon"
    }
  ],
  "mustSupport": true
}
```
