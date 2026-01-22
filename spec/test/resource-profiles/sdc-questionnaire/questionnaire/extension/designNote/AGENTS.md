## Element

```json
{
  "id": "Questionnaire.extension:designNote",
  "path": "Questionnaire.extension",
  "sliceName": "designNote",
  "comment": "Allows capture of todos, rationale for design decisions, etc.  It can also be used to capture comments about the completion of the form in general. Allows commentary to be captured during the process of answering a questionnaire (if not already supported by the form design) as well as after the form is completed. Comments are not part of the \"data\" of the form. If a form prompts for a comment, this should be captured in an answer, not in this element. Formal assessments of the QuestionnaireResponse would use [[[Observation]]].",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "Extension",
      "profile": [
        "http://hl7.org/fhir/StructureDefinition/designNote|5.3.0-ballot-tc1"
      ]
    }
  ]
}
```
