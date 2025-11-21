import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"text-wc-spinner-non-repeating-options-only",text:"Enter long text",type:"text",repeats:!1,control:"spinner",answerConstraint:"optionsOnly",answerOption:l("text",["Note A","Note B","Note C"])}),n=JSON.stringify(t.form.questionnaire,null,2),g={title:"Question/text/with item-control/spinner/non-repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:n},render:r=>s.jsx(o,{scenario:{name:"text-wc-spinner-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-spinner-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOnly"];export{e as OptionsOnly,x as __namedExportsOrder,g as default};
