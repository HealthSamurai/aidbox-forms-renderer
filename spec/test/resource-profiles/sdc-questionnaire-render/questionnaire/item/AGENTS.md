## Element

```json
{
  "id": "Questionnaire.item",
  "path": "Questionnaire.item",
  "constraint": [
    {
      "key": "sdc-rend-1",
      "severity": "error",
      "human": "Items with a controlType of 'page' can only appear in root-level items.",
      "expression": "extension('http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl').value.coding.where(system='http://hl7.org/fhir/questionnaire-item-control' and code='page').exists() implies %resource.item.where(linkId=%context.linkId).exists()",
      "xpath": "not(exists(f:extension[@url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl']/f:valueCodeableConcept/f:coding[f:system/@value='' and f:code/@value='page'])) or not(exists(parent::f:item))",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-render"
    }
  ]
}
```
