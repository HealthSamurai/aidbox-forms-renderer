## Element

```json
{
  "id": "Questionnaire",
  "path": "Questionnaire",
  "short": "Advanced Rendering Questionnaire",
  "definition": "Defines additional capabilities for controlling the rendering of the questionnaire.",
  "constraint": [
    {
      "key": "sdc-rend-2",
      "severity": "error",
      "human": "If a questionnaire has child items with a controlType of page, then all items must have a type of page, header or footer.",
      "expression": "item.where(extension('http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl').value.coding.where(system='http://hl7.org/fhir/questionnaire-item-control' and code='page').exists()).exists() implies item.all(extension('http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl').value.coding.where(system='http://hl7.org/fhir/questionnaire-item-control' and (code='page' or code='header' or code='footer')).exists())",
      "xpath": "not(exists(f:item[f:extension[@url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and f:valueCodeableConcept/f:coding[f:system/@value='' and f:code/@value='page']]])) or count(f:item) = count(f:item[f:extension[@url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and f:valueCodeableConcept/f:coding[f:system/@value='' and f:code[@value='page' or @value='header' or @value='footer']]]])",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-render"
    }
  ],
  "mapping": [{ "identity": "ihe-sdc", "map": "Form_Package" }]
}
```
