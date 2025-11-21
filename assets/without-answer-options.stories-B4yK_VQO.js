import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"boolean-wc-text-box-non-repeating-noopts",text:"Boolean question",type:"boolean",repeats:!1,control:"text-box"}),o=JSON.stringify(n.form.questionnaire,null,2),x={title:"Question/boolean/with item-control/text-box/non-repeating/without answer-options",component:t,parameters:i,argTypes:s},e={name:"without answer-options",args:{questionnaireSource:o},render:r=>a.jsx(t,{scenario:{name:"boolean-wc-text-box-non-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-text-box-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,b as __namedExportsOrder,x as default};
