## Element

```json
{
  "id": "Questionnaire.extension:submissionEndpoint",
  "path": "Questionnaire.extension",
  "sliceName": "submissionEndpoint",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-endpoint"
      ]
    }
  ],
  "mustSupport": true,
  "mapping": [
    {
      "identity": "ihe-sdc",
      "map": "administrative_package/submissionRule/destination/endpoint"
    }
  ]
}
```
