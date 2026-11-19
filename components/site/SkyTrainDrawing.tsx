/*
  SkyTrain loop: the animated drawing in the site footer.

  Ported 1:1 from the Figma node "drawing" (file gp7T0cPbPep5VLlx1dSNk0,
  e.g. 633:895 / 645:2342). Every layer keeps its Figma geometry inside a fixed
  547.106 x 320 box, and SkyTrainScene scales that box to fit its column.

  Motion (components/site/skytrain.css) is the Figma timeline for this node:
  an 11s loop where four parallax tiles scroll past both windows, the view
  sways with the train, and the passengers' head, hair and thumbs move.
  Layers carrying a `sky-*` class are the animated ones.
*/
const a = (file: string) => `/images/site/skytrain/${file}`;

export default function SkyTrainDrawing() {
  return (
    <div className="bg-[#202020] h-[320px] overflow-clip relative w-[547.106px]" data-skytrain="">
      <div className="absolute h-[272.128px] left-[5.41px] top-[47.87px] w-[93.749px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mask-group.svg")} />
      </div>
      <div className="absolute h-[272.128px] left-[103.72px] top-[47.87px] w-[93.749px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mask-group-1.svg")} />
      </div>
      <div className="absolute bg-[#24315e] h-[137.631px] left-[9.69px] overflow-clip rounded-[8.549px] top-[82.92px] w-[183.223px]">
        <div className="sky-sway absolute h-[159.573px] left-0 top-[-28.78px] w-[256.456px]">
          <div className="absolute h-[159.573px] left-0 top-0 w-[315.156px]" style={{ backgroundImage: "linear-gradient(180deg, rgb(36, 49, 94) 0%, rgb(185, 120, 127) 50%, rgb(240, 177, 136) 78%, rgb(248, 221, 180) 100%)" }} />
          <div className="sky-pan sky-pan-mountains absolute h-[115.975px] left-0 top-[17.95px] w-[769.368px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mountains-900px-tile.svg")} />
          </div>
          <div className="sky-pan sky-pan-towers absolute h-[94.319px] left-[1.43px] top-[47.02px] w-[1025.824px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("far-towers-600px-tile.svg")} />
          </div>
          <div className="sky-pan sky-pan-mid absolute h-[96.028px] left-0 top-[50.72px] w-[1410.507px]">
            <div className="absolute inset-[0_0_-8.26%_0]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("mid-buildings-450px-tile.svg")} />
            </div>
          </div>
          <div className="sky-pan sky-pan-near absolute h-[85.485px] left-0 top-[74.09px] w-[2393.588px]">
            <div className="absolute inset-[0_0_0_-0.46%]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("near-trees-posts-300px-tile.svg")} />
            </div>
          </div>
          <div className="absolute bg-[#3b4256] inset-[88.57%_1.89%_-4.29%_-1.89%]" />
          <div className="absolute bg-[#5b6480] inset-[88.57%_1.89%_10.36%_-1.89%]" />
        </div>
        <div className="absolute h-[148.175px] left-0 top-[-23.08px] w-[256.456px]">
          <div className="absolute inset-[0_0_-8.65%_-8.89%]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("glass-reflection.svg")} />
          </div>
        </div>
        <div className="absolute flex inset-[0_41.99%_94%_53.81%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="flex-none h-[100cqh] rotate-180 w-[100cqw]">
            <div className="relative size-full">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-732.svg")} />
            </div>
          </div>
        </div>
        <div className="absolute flex inset-[94%_41.99%_0_53.81%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <div className="relative size-full">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-732.svg")} />
            </div>
          </div>
        </div>
        <div className="absolute h-[8.264px] left-[77.22px] top-[129.37px] w-[7.694px]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-730.svg")} />
        </div>
        <div className="absolute flex inset-[0_53.65%_94%_42.15%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <div className="relative size-full">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-730.svg")} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#24315e] border-[#2a2e37] border-[5.129px] border-solid h-[125.093px] left-[223.4px] overflow-clip rounded-[15.957px] top-[61.55px] w-[316.581px]">
        <div className="sky-sway absolute h-[159.573px] left-[-5.13px] top-[-33.91px] w-[256.456px]">
          <div className="absolute h-[159.573px] left-0 top-0 w-[315.156px]" style={{ backgroundImage: "linear-gradient(180deg, rgb(36, 49, 94) 0%, rgb(185, 120, 127) 50%, rgb(240, 177, 136) 78%, rgb(248, 221, 180) 100%)" }} />
          <div className="absolute left-[159.57px] size-[39.893px] top-[76.94px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("sun.svg")} />
          </div>
          <div className="sky-pan sky-pan-mountains absolute h-[62.689px] left-0 top-[71.24px] w-[769.368px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mountains-900px-tile-1.svg")} />
          </div>
          <div className="sky-pan sky-pan-towers absolute h-[83.206px] left-0 top-[65.54px] w-[1025.824px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("far-towers-600px-tile-1.svg")} />
          </div>
          <div className="sky-pan sky-pan-mid absolute h-[67.533px] left-0 top-[81.21px] w-[1410.507px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mid-buildings-450px-tile-1.svg")} />
          </div>
          <div className="sky-pan sky-pan-near absolute h-[85.485px] left-0 top-[74.09px] w-[2393.588px]">
            <div className="absolute inset-[0_0_-17.34%_0]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("near-trees-posts-300px-tile-1.svg")} />
            </div>
          </div>
        </div>
        <div className="absolute h-[148.175px] left-[-5.13px] top-[-28.21px] w-[256.456px]">
          <div className="absolute inset-[0_0_0_-8.89%]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("glass-reflection-1.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute h-[19.039px] left-[305.75px] top-[293.5px] w-[107.996px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-640.svg")} />
      </div>
      <div className="absolute h-[19.039px] left-[305.75px] top-[293.5px] w-[107.996px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-640.svg")} />
      </div>
      <div className="absolute h-[19.039px] left-[205.74px] top-[293.5px] w-[107.996px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-640.svg")} />
      </div>
      <div className="absolute h-[17.955px] left-[406.34px] top-[293.5px] w-[107.711px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" height="17.955" src={a("rectangle-641.png")} width="107.711" />
      </div>
      <div className="absolute h-[17.952px] left-[506.64px] top-[293.5px] w-[107.711px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-643.svg")} />
      </div>
      <div className="absolute h-[44.452px] left-[312.59px] top-[249.05px] w-[101.158px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-639.svg")} />
      </div>
      <div className="absolute h-[44.452px] left-[312.59px] top-[249.05px] w-[101.158px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-639.svg")} />
      </div>
      <div className="absolute h-[44.452px] left-[212.57px] top-[249.05px] w-[101.158px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-639.svg")} />
      </div>
      <div className="absolute h-[44.452px] left-[412.89px] top-[249.05px] w-[101.158px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" height="44.452" src={a("rectangle-642.png")} width="101.158" />
      </div>
      <div className="absolute h-[44.452px] left-[513.2px] top-[249.05px] w-[101.158px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-639.svg")} />
      </div>
      <div className="absolute h-[18.106px] left-[253.46px] top-[132.63px] w-[50.864px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-666.svg")} />
      </div>
      <div className="absolute h-[16.391px] left-[254.3px] top-[134.63px] w-[50.025px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-603.svg")} />
      </div>
      <div className="absolute h-[12.823px] left-[269.28px] top-[139.34px] w-[17.667px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-611.svg")} />
      </div>
      <div className="absolute h-[73.517px] left-[196.8px] top-[114.83px] w-[30.205px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-597.svg")} />
      </div>
      <div className="absolute h-[64.541px] left-[193.77px] mix-blend-hard-light top-[190.63px] w-[144.897px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mask-group-2.svg")} />
      </div>
      <div className="absolute h-[64.541px] left-[314.02px] mix-blend-hard-light top-[191.2px] w-[144.897px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mask-group-2.svg")} />
      </div>
      <div className="absolute h-[64.541px] left-[435.69px] mix-blend-hard-light top-[192.63px] w-[144.897px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("mask-group-3.svg")} />
      </div>
      <div className="absolute h-[47.818px] left-[248.76px] top-[238.84px] w-[67.533px]" data-effect="hatch">
        <div className="h-[47.818px] relative w-[67.533px]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-613.svg")} />
        </div>
      </div>
      <div className="absolute h-[47.818px] left-[248.76px] top-[238.84px] w-[67.533px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-616.svg")} />
      </div>
      <div className="absolute h-[100.16px] left-[244.2px] top-[237.65px] w-[36.901px]" data-effect="hatch">
        <div className="h-[100.16px] relative w-[36.901px]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-595.svg")} />
        </div>
      </div>
      <div className="absolute flex h-[112.556px] items-center justify-center left-[286.09px] top-[235.23px] w-[35.761px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[112.556px] relative w-[35.761px]" data-effect="hatch">
            <div className="h-[112.556px] relative w-[35.761px]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-612.svg")} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[98.843px] left-[239.39px] top-[143.79px] w-[79.861px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-588.svg")} />
      </div>
      <div className="absolute h-[16.1px] left-[251.18px] top-[138.91px] w-[28.21px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-600.svg")} />
      </div>
      <div className="absolute flex h-[16.385px] items-center justify-center left-[278.68px] top-[138.77px] w-[30.205px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[16.385px] relative w-[30.205px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-601.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute h-[67.533px] left-[303.05px] top-[243.49px] w-[18.379px]">
        <div className="absolute inset-[0_-0.77%_0_-0.74%]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5344.svg")} />
        </div>
      </div>
      <div className="absolute h-[44.879783630371094px] left-[254.45px] overflow-visible top-[97.74px] w-[45.27734375px]">
        <div className="sky-head relative size-full">
          <div className="absolute h-[13.269px] left-0 top-[17.81px] w-[7.37px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-604.svg")} />
          </div>
          <div className="absolute flex h-[13.269px] items-center justify-center left-[37.91px] top-[16.53px] w-[7.37px]">
            <div className="-scale-y-100 flex-none rotate-180">
              <div className="h-[13.269px] relative w-[7.37px]">
                <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-605.svg")} />
              </div>
            </div>
          </div>
          <div className="absolute h-[44.88px] left-[4.28px] top-0 w-[37.044px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("ellipse-1675.svg")} />
          </div>
          <div className="absolute flex h-[8.5px] items-center justify-center left-[38.93px] top-[18.93px] w-[4.367px]">
            <div className="-scale-y-100 flex-none rotate-[11.03deg]">
              <div className="h-[8.1px] relative w-[2.871px]">
                <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("polygon-33.svg")} />
              </div>
            </div>
          </div>
          <div className="absolute flex h-[8.593px] items-center justify-center left-[1.15px] top-[20.8px] w-[5.512px]">
            <div className="flex-none rotate-[159.62deg]">
              <div className="h-[8.1px] relative w-[2.871px]">
                <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("polygon-34.svg")} />
              </div>
            </div>
          </div>
          <div className="absolute flex h-[2.368px] items-center justify-center left-[21.28px] top-[31.33px] w-[4.892px]">
            <div className="flex-none rotate-[7.49deg]">
              <div className="h-[1.771px] relative w-[4.702px]">
                <div className="absolute inset-[0_0_-8.27%_0]">
                  <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5340.svg")} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute h-[0.57px] left-[10.55px] top-[24.79px] w-[8.549px]">
            <div className="absolute inset-[-18.53%_-0.19%_-49.9%_-0.16%]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5338.svg")} />
            </div>
          </div>
          <div className="absolute h-[1.253px] left-[26.51px] top-[23.08px] w-[8.406px]">
            <div className="absolute inset-[-8.04%_-0.42%_-22.23%_-0.2%]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5339.svg")} />
            </div>
          </div>
          <div className="absolute h-[0.887px] left-[19.1px] top-[36.28px] w-[9.973px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-608.svg")} />
          </div>
          <div className="absolute h-[0.997px] left-[11.13px] top-[21.94px] w-[7.551px]">
            <div className="absolute inset-[-14.29%_-1.89%]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5345.svg")} />
            </div>
          </div>
          <div className="absolute flex h-[0.997px] items-center justify-center left-[25.94px] top-[21.37px] w-[7.551px]">
            <div className="-scale-y-100 flex-none rotate-180">
              <div className="h-[0.997px] relative w-[7.551px]">
                <div className="absolute inset-[-14.29%_-1.89%]">
                  <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5346.svg")} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute h-0 left-[22.23px] top-[35.9px] w-[3.134px]">
            <div className="absolute inset-[-0.28px_0_0_0]">
              <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("line-483.svg")} />
            </div>
          </div>
          <div className="absolute h-[1.869px] left-[11.13px] top-[22.8px] w-[7.279px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-665.svg")} />
          </div>
          <div className="absolute h-[1.639px] left-[26.66px] top-[22.15px] w-[7.699px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-731.svg")} />
          </div>
          <div className="absolute flex h-[5.527px] items-center justify-center left-[3.71px] top-[27.64px] w-[2.459px]">
            <div className="flex-none rotate-[-14.5deg]">
              <div className="bg-[#d9d9d9] h-[5.414px] relative w-[1.14px]" />
            </div>
          </div>
          <div className="absolute flex h-[5.528px] items-center justify-center left-[39.9px] top-[25.64px] w-[2.014px]">
            <div className="flex-none rotate-[9.46deg]">
              <div className="bg-[#d9d9d9] h-[5.414px] relative w-[1.14px]" />
            </div>
          </div>
          <div className="absolute flex h-[4.897px] items-center justify-center left-[2.17px] top-[24.31px] w-[3.82px]">
            <div className="flex-none rotate-[-15.34deg]">
              <div className="h-[4.316px] relative w-[2.777px]">
                <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-626.svg")} />
              </div>
            </div>
          </div>
          <div className="absolute flex h-[4.49px] items-center justify-center left-[39.9px] top-[22.8px] w-[3.055px]">
            <div className="-scale-y-100 flex-none rotate-[-176.22deg]">
              <div className="h-[4.316px] relative w-[2.777px]">
                <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-627.svg")} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sky-hair absolute h-[35.367px] left-[253.89px] top-[86.91px] w-[46.387px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("hair.svg")} />
      </div>
      <div className="absolute flex h-[63.117px] items-center justify-center left-[309.45px] top-[193.2px] w-[29.635px]">
        <div className="flex-none rotate-180">
          <div className="h-[63.117px] relative w-[29.635px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-609.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute h-[10.258px] left-[247.63px] top-[239.22px] w-[66.643px]">
        <div className="absolute inset-[-0.35%_-0.2%_-1.4%_0]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5342.svg")} />
        </div>
      </div>
      <div className="absolute h-[63.544px] left-[244.2px] top-[247.05px] w-[16.385px]">
        <div className="absolute inset-[0_-0.82%_0_-0.88%]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5343.svg")} />
        </div>
      </div>
      <div className="absolute flex h-[6.885px] items-center justify-center left-[266.02px] top-[241.77px] w-[3.113px]">
        <div className="flex-none rotate-[7.37deg]">
          <div className="h-[6.647px] relative w-[2.279px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-617.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[7.457px] items-center justify-center left-[296.33px] top-[237.79px] w-[3.94px]">
        <div className="flex-none rotate-[-16.68deg]">
          <div className="h-[7.199px] relative w-[1.956px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-618.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute h-[8.83px] left-[275.55px] top-[239.93px] w-[15.245px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-622.svg")} />
      </div>
      <div className="absolute h-[8.83px] left-[275.27px] top-[240.85px] w-[15.245px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-619.svg")} />
      </div>
      <div className="absolute h-[57.615px] left-[210.01px] top-[57.7px] w-[21.371px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("group-181.svg")} />
      </div>
      <div className="absolute h-[86.055px] left-[278.4px] top-[155.3px] w-[2.28px]">
        <div className="absolute inset-[0_-15.66%_0_-15.68%]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5347.svg")} />
        </div>
      </div>
      <div className="absolute bg-[#2d2d2d] h-[10.828px] left-[204.03px] top-[25.65px] w-[343.081px]" />
      <div className="absolute h-[35.619px] left-[215.56px] top-[24.51px] w-[7.836px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-631.svg")} />
      </div>
      <div className="absolute flex h-[68.133px] items-center justify-center left-[312.66px] top-[145.87px] w-[30.1px]">
        <div className="flex-none rotate-[173.23deg]">
          <div className="h-[65.943px] relative w-[22.488px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-610.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute h-[70.81px] left-[279.54px] top-[249.05px] w-[6.981px]">
        <div className="absolute inset-[0_-2.04%]">
          <img alt="" loading="lazy" decoding="async" draggable={false} className="block max-w-none size-full" src={a("vector-5348.svg")} />
        </div>
      </div>
      <div className="absolute flex h-[57.209px] items-center justify-center left-[187.5px] top-[149.31px] w-[67.917px]">
        <div className="-scale-y-100 flex-none rotate-[-119.23deg]">
          <div className="h-[59.9px] relative w-[32.037px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-598.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute h-[9.688px] left-[304.61px] top-[245.91px] w-[9.403px]">
        <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-649.svg")} />
      </div>
      <div className="absolute flex h-[31.652px] items-center justify-center left-[210.14px] top-[148.74px] w-[35.413px]">
        <div className="flex-none rotate-[-40.15deg]">
          <div className="h-[8.057px] relative w-[39.535px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-667.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[40.485px] items-center justify-center left-[317.52px] top-[169.28px] w-[8.671px]">
        <div className="flex-none rotate-[-91.02deg]">
          <div className="h-[7.957px] relative w-[40.35px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-668.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[42.214px] items-center justify-center left-[240.15px] top-[177.24px] w-[10.709px]">
        <div className="flex-none rotate-[-94.91deg]">
          <div className="h-[7.162px] relative w-[41.754px]">
            <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-669.svg")} />
          </div>
        </div>
      </div>
      <div className="absolute contents left-[455.35px] top-[104.58px]">
        <div className="absolute bg-gradient-to-b from-white h-[255.732px] left-[435.42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[19.934px_13.113px] mask-size-[91.758px_234.802px] to-[rgba(153,153,153,0)] top-[91.46px] w-[130.092px]" style={{ maskImage: `url("${a("rectangle-687.svg")}")` }} />
      </div>
      <div className="absolute contents left-[381.83px] top-[83.49px]">
        <div className="absolute flex h-[293.784px] items-center justify-center left-[343.09px] top-[64.4px] w-[151.196px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-gradient-to-b from-white h-[293.784px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[38.741px_19.09px] mask-size-[99.447px_248.762px] relative to-[rgba(153,153,153,0)] w-[151.196px]" style={{ maskImage: `url("${a("rectangle-662.svg")}")` }} />
          </div>
        </div>
        <div className="absolute flex h-[9.642px] items-center justify-center left-[416.6px] top-[111.99px] w-[11.757px]">
          <div style={{ transform: "matrix(0.8569938540458679, 0.5153266787528992, -0.5153266787528992, 0.8569938540458679, 0, 0)" }} className="flex-none h-[4.701691627502441px] w-[10.891433715820312px]">
            <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[99.447px_248.762px]" style={{ maskImage: `url("${a("rectangle-662.svg")}")` }}>
              <div className="sky-glow h-[4.702px] relative w-[10.891px]">
                <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("polygon-36.svg")} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#333] h-[137.631px] left-[94.61px] top-[82.92px] w-[4.559px]" />
      <div className="absolute bg-[#333] h-[137.631px] left-[103.72px] top-[82.92px] w-[4.559px]" />
      <div className="absolute bg-[#8b8b8b] h-[137.631px] left-[99.16px] top-[82.92px] w-[4.559px]" />
      <div className="absolute contents left-[13.97px] top-[94.6px]">
        <div className="absolute flex h-[259.858px] items-center justify-center left-[2.85px] top-[88.05px] w-[120.735px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="bg-gradient-to-b from-white h-[259.858px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[11.126px_6.555px] mask-size-[102.016px_225.112px] relative to-[rgba(153,153,153,0)] w-[120.735px]" style={{ maskImage: `url("${a("rectangle-698.svg")}")` }} />
          </div>
        </div>
        <div className="absolute flex h-[5.414px] items-center justify-center left-[55.28px] top-[133.36px] w-[9.513px]">
          <div style={{ transform: "matrix(0.9617778062820435, 0.2738310992717743, -0.2738310992717743, 0.9617778062820435, 0, 0)" }} className="flex-none h-[3.0613489151000977px] w-[9.019177436828613px]">
            <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[102.016px_225.112px]" style={{ maskImage: `url("${a("rectangle-698.svg")}")` }}>
              <div className="sky-thumb h-[3.061px] relative w-[9.019px]">
                <img alt="" loading="lazy" decoding="async" draggable={false} className="absolute block inset-0 max-w-none size-full" src={a("rectangle-735.svg")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
