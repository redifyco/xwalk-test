export default function decorate(block) {
    const title = block.querySelector(':scope > div:nth-child(1) div p')?.textContent || ''
    const isLoadMoreButton = block.querySelector(':scope > div:nth-child(2) div p')?.textContent === 'true'
    const buttonText = block.querySelector(':scope > div:nth-child(3) div p')?.textContent || ''
    const buttonLink = block.querySelector(':scope > div:nth-child(4) div a')?.href || ''
    const itemsToShow = Number(block.querySelector(':scope > div:nth-child(5) div p')?.textContent) || 3
    const cardStyle = block.querySelector(':scope > div:nth-child(6) div p')?.textContent || 'card-style-1'


    console.log('isLoadMoreButton', isLoadMoreButton)
    console.log('block', block);

    const sectionContainer = document.createElement('section');
    sectionContainer.className = ''

    sectionContainer.innerHTML = `
     <section
      class="flex flex-col items-center justify-center gap-8 px-4 pb-14 lg:gap-32 lg:px-20 lg:py-14"
    >
      <h2 class="text-primary text-center text-3xl uppercase lg:text-7xl">
        <span class="font-joyful-xs lg:font-joyful-sm capitalize">Related</span>
        programmes
      </h2>
      <!--RELATED PROGRAMMES-->
      <div
        class="scrollbar scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-gray-300 flex max-w-full justify-start gap-6 overflow-x-scroll pb-5 lg:flex-wrap lg:justify-center"
      >
        <!--BLOG CARD 1-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
        <!--BLOG CARD 2-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
        <!--BLOG CARD 3-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
        <!--BLOG CARD 4-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
        <!--BLOG CARD 5-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
        <!--BLOG CARD 6-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
        <!--BLOG CARD 7-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
        <!--BLOG CARD 8-->
        <a
          href="https://google.com"
          class="min-w-80 border border-gray-400 lg:max-w-[350px] xl:max-w-[432px]"
        >
          <div class="relative">
            <img src="/assets/images/marevivo-2.jpeg" alt="" />
            <div class="absolute right-2 bottom-2 flex gap-1">
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
              <div class="flex size-10 items-center justify-center bg-white">
                <img
                  src="/assets/icons/environmental.svg"
                  class="size-8"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-4 p-6">
            <h5
              class="text-primary line-clamp-2 text-base font-semibold lg:text-xl 2xl:line-clamp-3 2xl:text-3xl"
            >
              Together for the Sea
            </h5>
            <div
              class="w-full border-t border-t-gray-400 pt-2 text-xs lg:text-base 2xl:pt-3"
            >
              <p>MSC FOUNDATION & MAREVIVO</p>
            </div>
          </div>
        </a>
      </div>
      <!--CUSTOM BUTTON-->
      <a
        href=""
        class="group border-primary relative inline-block border p-2 lg:border-0"
      >
        <span
          class="button-line-absolute-theme -top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12"
        ></span>
        <span
          class="button-line-absolute-theme -top-1 -right-1 h-full w-0.5 group-hover:h-9/12"
        ></span>
        <span
          class="button-line-absolute-theme -bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12"
        ></span>
        <span
          class="button-line-absolute-theme -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12"
        ></span>
        <span class="text-primary px-6 py-2">Donate Now</span>
      </a>
    </section>
    `

    block.append(sectionContainer)

}
