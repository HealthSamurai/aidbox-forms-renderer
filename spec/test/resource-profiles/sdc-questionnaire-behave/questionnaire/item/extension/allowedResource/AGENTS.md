## Element

```json
{
  "id": "Questionnaire.item.extension:allowedResource",
  "path": "Questionnaire.item.extension",
  "sliceName": "allowedResource",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/questionnaire-referenceResource|5.3.0-ballot-tc1"
      ]
    }
  ],
  "mustSupport": true,
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "/form_package/mapping_package/mdr_mapping/question_element_data_element_association[question_element_identifier=current()/question_identifier]/data_element_scoped_identifier"
    }
  ]
}
```
