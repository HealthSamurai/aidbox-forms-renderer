import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=l({linkId:"attachment-wc-slider-repeating-options-only",text:"Upload an attachment",type:"attachment",repeats:!0,control:"slider",answerConstraint:"optionsOnly",answerOption:p("attachment",[{url:"https://example.com/file.pdf",title:"Consent Form"},{url:"https://example.com/file2.pdf",title:"Information Sheet"}])}),t=JSON.stringify(o.form.questionnaire,null,2),h={title:"Question/attachment/with item-control/slider/repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:t},render:r=>a.jsx(n,{scenario:{name:"attachment-wc-slider-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-slider-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const y=["OptionsOnly"];export{e as OptionsOnly,y as __namedExportsOrder,h as default};
