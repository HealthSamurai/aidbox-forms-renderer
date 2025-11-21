import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"boolean-wc-slider-non-repeating-options-or-type",text:"Boolean question",type:"boolean",repeats:!1,control:"slider",answerConstraint:"optionsOrType",answerOption:l("boolean",[!0,!1])}),o=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/boolean/with item-control/slider/non-repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:o},render:t=>s.jsx(r,{scenario:{name:"boolean-wc-slider-non-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-slider-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOrType"];export{e as OptionsOrType,g as __namedExportsOrder,f as default};
