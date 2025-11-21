import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"text-wc-spinner-non-repeating-options-or-type",text:"Enter long text",type:"text",repeats:!1,control:"spinner",answerConstraint:"optionsOrType",answerOption:u("text",["Note A","Note B","Note C"])}),t=JSON.stringify(n.form.questionnaire,null,2),g={title:"Question/text/with item-control/spinner/non-repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:t},render:r=>s.jsx(o,{scenario:{name:"text-wc-spinner-non-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-spinner-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrType"];export{e as OptionsOrType,x as __namedExportsOrder,g as default};
