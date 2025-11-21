import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"text-wc-text-box-non-repeating-options-only",text:"Enter long text",type:"text",repeats:!1,control:"text-box",answerConstraint:"optionsOnly",answerOption:l("text",["Note A","Note B","Note C"])}),t=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/text/with item-control/text-box/non-repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:t},render:r=>s.jsx(o,{scenario:{name:"text-wc-text-box-non-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-text-box-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,S as default};
