import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=l({linkId:"url-wc-autocomplete-non-repeating-options-only",text:"Enter a URL",type:"url",repeats:!1,control:"autocomplete",answerConstraint:"optionsOnly",answerOption:p("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/url/with item-control/autocomplete/non-repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(t,{scenario:{name:"url-wc-autocomplete-non-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-autocomplete-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,f as default};
