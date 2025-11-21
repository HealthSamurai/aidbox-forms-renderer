import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"url-wc-autocomplete-non-repeating-options-or-string",text:"Enter a URL",type:"url",repeats:!1,control:"autocomplete",answerConstraint:"optionsOrString",answerOption:u("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/url/with item-control/autocomplete/non-repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"url-wc-autocomplete-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-autocomplete-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const h=["OptionsOrString"];export{e as OptionsOrString,h as __namedExportsOrder,f as default};
