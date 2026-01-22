## Element

```json
{
  "id": "Questionnaire",
  "path": "Questionnaire",
  "short": "Adaptive Questionnaire",
  "definition": "Defines the metadata that should be present when embedding a adaptive Questionnaire as part of a QuestionnaireResponse.",
  "constraint": [
    {
      "key": "sdc-adapt-1",
      "severity": "error",
      "human": "An adaptive questionnaire must be a contained resource within a QuestionnaireResponse.",
      "expression": "%rootResource.ofType(QuestionnaireResponse).questionnaire='#' + $this.id or %rootResource.contained.ofType(QuestionnaireResponse).exists(questionnaire='#' + $this.id)",
      "source": "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-adapt"
    }
  ],
  "mapping": [{ "identity": "ihe-sdc", "map": "Form_Package" }]
}
```
