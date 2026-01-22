## Element

```json
{
  "id": "Questionnaire.item.extension:displayCategory",
  "path": "Questionnaire.item.extension",
  "sliceName": "displayCategory",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/questionnaire-displayCategory|5.3.0-ballot-tc1"
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
