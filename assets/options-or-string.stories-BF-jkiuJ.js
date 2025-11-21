import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"boolean-wc-autocomplete-repeating-options-or-string",text:"Boolean question",type:"boolean",repeats:!0,control:"autocomplete",answerConstraint:"optionsOrString",answerOption:u("boolean",[!0,!1])}),o=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/boolean/with item-control/autocomplete/repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options or string",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"boolean-wc-autocomplete-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-autocomplete-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,f as default};
