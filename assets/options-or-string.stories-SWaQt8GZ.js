import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"boolean-wc-text-box-non-repeating-options-or-string",text:"Boolean question",type:"boolean",repeats:!1,control:"text-box",answerConstraint:"optionsOrString",answerOption:u("boolean",[!0,!1])}),o=JSON.stringify(t.form.questionnaire,null,2),b={title:"Question/boolean/with item-control/text-box/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:o},render:r=>s.jsx(n,{scenario:{name:"boolean-wc-text-box-non-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-text-box-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrString"];export{e as OptionsOrString,x as __namedExportsOrder,b as default};
