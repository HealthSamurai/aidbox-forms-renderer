import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=l({linkId:"text-wc-slider-non-repeating-options-only",text:"Enter long text",type:"text",repeats:!1,control:"slider",answerConstraint:"optionsOnly",answerOption:p("text",["Note A","Note B","Note C"])}),o=JSON.stringify(n.form.questionnaire,null,2),g={title:"Question/text/with item-control/slider/non-repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:r=>s.jsx(t,{scenario:{name:"text-wc-slider-non-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "text-wc-slider-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOnly"];export{e as OptionsOnly,x as __namedExportsOrder,g as default};
