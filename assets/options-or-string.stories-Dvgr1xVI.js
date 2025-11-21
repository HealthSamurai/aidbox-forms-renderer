import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as r,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"boolean-wc-radio-button-repeating-options-or-string",text:"Boolean question",type:"boolean",repeats:!0,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("boolean",[!0,!1])}),e=JSON.stringify(t.form.questionnaire,null,2),b={title:"Question/boolean/with item-control/radio-button/repeating/with answer-options",component:r,parameters:i,argTypes:s},o={name:"options or string",args:{questionnaireSource:e},render:n=>a.jsx(r,{scenario:{name:"boolean-wc-radio-button-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-radio-button-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const f=["OptionsOrString"];export{o as OptionsOrString,f as __namedExportsOrder,b as default};
