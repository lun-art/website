export default function AboutBlock(props: AboutBlockProps) {
  return (
    <>
      <div className={`relative p-4 border-b md:border-b-0 ${props.className}`}>
        <p
          className={`uppercase font-normal text-left text-white font-['Helvetica_Neue'] text-[42px]`}
        >
          {props.title}
        </p>
        <p
          className={`text-base font-normal text-left pt-6 m-0 leading-[normal] text-[rgba(232,230,230,1)] min-h-[200px] max-w-[400px]`}
        >
          {props.desc}
        </p>
        <p
          className={`text-xs font-bold tracking-widest leading-[normal] text-[rgba(232,230,230,1)] text-right`}
        >
          {props.index}
        </p>
        {props.type === "TYPE" && <span className="absolute right-4 top-8">×</span>}
        {props.type === "TYPE1" && <span className="absolute right-4 top-8">+</span>}
        {props.type === "TYPE2" && <span className="absolute bottom-4 left-4">×</span>}
        {props.type === "TYPE3" && <span className="absolute bottom-4 left-4">+</span>}
      </div>
    </>
  );
}

AboutBlock.defaultProps = {
  className: "",
  type: "TYPE",
  title: "LOREM",
  desc:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis risus tempus morbi nunc tellus sit ipsum. Faucibus sed est amet hac auctor aliquam volutpat eu.",
  index: "03",
};

interface AboutBlockProps {
  className: string;
  type: "TYPE" | "TYPE1" | "TYPE2" | "TYPE3";
  title: string;
  desc: string;
  index: string;
}


