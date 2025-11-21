import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"text-wc-spinner-repeating-options-only",text:"Enter long text",type:"text",repeats:!0,control:"spinner",answerConstraint:"optionsOnly",answerOption:u("text",["Note A","Note B","Note C"])}),n=JSON.stringify(o.form.questionnaire,null,2),g={title:"Question/text/with item-control/spinner/repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:n},render:r=>s.jsx(t,{scenario:{name:"text-wc-spinner-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-spinner-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOnly"];export{e as OptionsOnly,x as __namedExportsOrder,g as default};
