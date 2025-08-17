import Constants from "expo-constants";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
// 마커 관련 코드는 파일 내부에 통합

// 마커 이미지 생성 함수들
const createCulturalMarkerImages = () => {
  return {
    독립서점: `<svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1667_1521)">
          <mask id="path-1-outside-1_1667_1521" maskUnits="userSpaceOnUse" x="6" y="5" width="37" height="42" fill="black">
            <rect fill="white" x="6" y="5" width="37" height="42"/>
            <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z"/>
          </mask>
          <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z" fill="#08A758"/>
          <path d="M19.9256 39.5646L19.6853 40.5353L19.9256 39.5646ZM24.8982 44.5323L24.0321 44.0323L24.8982 44.5323ZM23.1661 44.5324L24.0321 44.0323L23.1661 44.5324ZM28.138 39.5646L28.3782 40.5353L28.138 39.5646ZM27.4875 40.047L28.3536 40.5469L27.4875 40.047ZM24.0322 6V7C32.8866 7 40.0645 14.1779 40.0645 23.0322H41.0645H42.0645C42.0645 13.0733 33.9912 5 24.0322 5V6ZM41.0645 23.0322H40.0645C40.0645 30.5526 34.8852 36.8643 27.8977 38.5938L28.138 39.5646L28.3782 40.5353C36.2369 38.5901 42.0645 31.4939 42.0645 23.0322H41.0645ZM27.4875 40.047L26.6215 39.547L24.0321 44.0323L24.8982 44.5323L25.7642 45.0322L28.3536 40.5469L27.4875 40.047ZM23.1661 44.5324L24.0321 44.0323L21.4419 39.5468L20.5759 40.0469L19.71 40.5469L22.3001 45.0324L23.1661 44.5324ZM19.9256 39.5646L20.1659 38.5939C13.1788 36.8641 8 30.5523 8 23.0322H7H6C6 31.4935 11.827 38.5898 19.6853 40.5353L19.9256 39.5646ZM7 23.0322H8C8 14.1779 15.1779 7 24.0322 7V6V5C14.0733 5 6 13.0733 6 23.0322H7ZM20.5759 40.0469L21.4419 39.5468C21.1584 39.0558 20.6883 38.7232 20.1659 38.5939L19.9256 39.5646L19.6853 40.5353C19.6958 40.5378 19.7031 40.5419 19.7072 40.5449C19.711 40.5477 19.711 40.5488 19.71 40.5469L20.5759 40.0469ZM24.8982 44.5323L24.0321 44.0323L23.1661 44.5324L22.3001 45.0324C23.07 46.3657 24.9945 46.3656 25.7642 45.0322L24.8982 44.5323ZM28.138 39.5646L27.8977 38.5938C27.3752 38.7232 26.905 39.0559 26.6215 39.547L27.4875 40.047L28.3536 40.5469C28.3525 40.5488 28.3525 40.5477 28.3563 40.5449C28.3604 40.5419 28.3677 40.5379 28.3782 40.5353L28.138 39.5646Z" fill="white" mask="url(#path-1-outside-1_1667_1521)"/>
        </g>
        <path d="M18.6383 29.7419C18.2145 29.7419 17.8518 29.5848 17.5503 29.2706C17.2482 28.9559 17.0972 28.5777 17.0972 28.1362V21.7534C16.8018 21.4724 16.574 21.1111 16.4137 20.6695C16.2529 20.2279 16.2495 19.7462 16.4037 19.2243L17.2128 16.4946C17.3155 16.1467 17.4987 15.859 17.7622 15.6315C18.0252 15.404 18.3301 15.2903 18.6769 15.2903H29.3879C29.7346 15.2903 30.0364 15.4005 30.2933 15.6211C30.5502 15.8421 30.7364 16.1333 30.852 16.4946L31.6611 19.2243C31.8152 19.7462 31.8121 20.2212 31.6518 20.6494C31.491 21.0776 31.2629 21.4456 30.9676 21.7534V28.1362C30.9676 28.5777 30.8168 28.9559 30.5152 29.2706C30.2132 29.5848 29.8502 29.7419 29.4264 29.7419H18.6383ZM25.7276 20.9104C26.0744 20.9104 26.3377 20.7864 26.5175 20.5386C26.6973 20.2913 26.7679 20.0138 26.7294 19.7061L26.3056 16.896H24.8029V19.8666C24.8029 20.1476 24.8928 20.392 25.0726 20.5996C25.2524 20.8068 25.4708 20.9104 25.7276 20.9104ZM22.26 20.9104C22.5554 20.9104 22.7964 20.8068 22.9828 20.5996C23.1688 20.392 23.2618 20.1476 23.2618 19.8666V16.896H21.7592L21.3354 19.7061C21.284 20.0272 21.3515 20.3082 21.538 20.5491C21.724 20.7899 21.9647 20.9104 22.26 20.9104ZM18.831 20.9104C19.0622 20.9104 19.2643 20.8234 19.4374 20.6494C19.6111 20.4755 19.7171 20.2547 19.7557 19.9871L20.1795 16.896H18.6769L17.9063 19.5856C17.8292 19.8532 17.8708 20.1409 18.0311 20.4487C18.1919 20.7565 18.4585 20.9104 18.831 20.9104ZM29.2338 20.9104C29.6062 20.9104 29.8759 20.7565 30.0429 20.4487C30.2098 20.1409 30.2484 19.8532 30.1585 19.5856L29.3493 16.896H27.8853L28.3091 19.9871C28.3476 20.2547 28.4537 20.4755 28.6273 20.6494C28.8004 20.8234 29.0026 20.9104 29.2338 20.9104Z" fill="white"/>
        <defs>
          <filter id="filter0_d_1667_1521" x="0.838709" y="0.870968" width="46.387" height="51.3548" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.03226"/>
            <feGaussianBlur stdDeviation="2.58065"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1667_1521"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1667_1521" result="shape"/>
          </filter>
        </defs>
      </svg>`,
    북카페: `<svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1659_1691)">
          <mask id="path-1-outside-1_1659_1691" maskUnits="userSpaceOnUse" x="6" y="5" width="37" height="42" fill="black">
            <rect fill="white" x="6" y="5" width="37" height="42"/>
            <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z"/>
          </mask>
          <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z" fill="#08A758"/>
          <path d="M19.9256 39.5646L19.6853 40.5353L19.9256 39.5646ZM24.8982 44.5323L24.0321 44.0323L24.8982 44.5323ZM23.1661 44.5324L24.0321 44.0323L23.1661 44.5324ZM28.138 39.5646L28.3782 40.5353L28.138 39.5646ZM27.4875 40.047L28.3536 40.5469L27.4875 40.047ZM24.0322 6V7C32.8866 7 40.0645 14.1779 40.0645 23.0322H41.0645H42.0645C42.0645 13.0733 33.9912 5 24.0322 5V6ZM41.0645 23.0322H40.0645C40.0645 30.5526 34.8852 36.8643 27.8977 38.5938L28.138 39.5646L28.3782 40.5353C36.2369 38.5901 42.0645 31.4939 42.0645 23.0322H41.0645ZM27.4875 40.047L26.6215 39.547L24.0321 44.0323L24.8982 44.5323L25.7642 45.0322L28.3536 40.5469L27.4875 40.047ZM23.1661 44.5324L24.0321 44.0323L21.4419 39.5468L20.5759 40.0469L19.71 40.5469L22.3001 45.0324L23.1661 44.5324ZM19.9256 39.5646L20.1659 38.5939C13.1788 36.8641 8 30.5523 8 23.0322H7H6C6 31.4935 11.827 38.5898 19.6853 40.5353L19.9256 39.5646ZM7 23.0322H8C8 14.1779 15.1779 7 24.0322 7V6V5C14.0733 5 6 13.0733 6 23.0322H7ZM20.5759 40.0469L21.4419 39.5468C21.1584 39.0558 20.6883 38.7232 20.1659 38.5939L19.9256 39.5646L19.6853 40.5353C19.6958 40.5378 19.7031 40.5419 19.7072 40.5449C19.711 40.5477 19.711 40.5488 19.71 40.5469L20.5759 40.0469ZM24.8982 44.5323L24.0321 44.0323L23.1661 44.5324L22.3001 45.0324C23.07 46.3657 24.9945 46.3656 25.7642 45.0322L24.8982 44.5323ZM28.138 39.5646L27.8977 38.5938C27.3752 38.7232 26.905 39.0559 26.6215 39.547L27.4875 40.047L28.3536 40.5469C28.3525 40.5488 28.3525 40.5477 28.3563 40.5449C28.3604 40.5419 28.3677 40.5379 28.3782 40.5353L28.138 39.5646Z" fill="white" mask="url(#path-1-outside-1_1659_1691)"/>
        </g>
        <path d="M30.8579 15.8965H17.9875C16.8549 15.8965 15.9282 16.8232 15.9282 17.9558V23.835C15.9282 27.7785 18.9656 31.2277 22.9091 31.341C26.9865 31.4646 30.3431 28.1903 30.3431 24.1336V23.1039H30.8579C32.8451 23.1039 34.4616 21.4874 34.4616 19.5002C34.4616 17.513 32.8451 15.8965 30.8579 15.8965ZM28.2838 17.9558V21.0447H17.9875V17.9558H28.2838ZM30.8579 21.0447H30.3431V17.9558H30.8579C31.7125 17.9558 32.4024 18.6456 32.4024 19.5002C32.4024 20.3548 31.7125 21.0447 30.8579 21.0447Z" fill="white"/>
        <defs>
          <filter id="filter0_d_1659_1691" x="0.838709" y="0.870968" width="46.387" height="51.3548" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.03226"/>
            <feGaussianBlur stdDeviation="2.58065"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1659_1691"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1659_1691" result="shape"/>
          </filter>
        </defs>
      </svg>`,
    북스테이: `<svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1669_107)">
          <mask id="path-1-outside-1_1669_107" maskUnits="userSpaceOnUse" x="6" y="5" width="37" height="42" fill="black">
            <rect fill="white" x="6" y="5" width="37" height="42"/>
            <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z"/>
          </mask>
          <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z" fill="#08A758"/>
          <path d="M19.9256 39.5646L19.6853 40.5353L19.9256 39.5646ZM24.8982 44.5323L24.0321 44.0323L24.8982 44.5323ZM23.1661 44.5324L24.0321 44.0323L23.1661 44.5324ZM28.138 39.5646L28.3782 40.5353L28.138 39.5646ZM27.4875 40.047L28.3536 40.5469L27.4875 40.047ZM24.0322 6V7C32.8866 7 40.0645 14.1779 40.0645 23.0322H41.0645H42.0645C42.0645 13.0733 33.9912 5 24.0322 5V6ZM41.0645 23.0322H40.0645C40.0645 30.5526 34.8852 36.8643 27.8977 38.5938L28.138 39.5646L28.3782 40.5353C36.2369 38.5901 42.0645 31.4939 42.0645 23.0322H41.0645ZM27.4875 40.047L26.6215 39.547L24.0321 44.0323L24.8982 44.5323L25.7642 45.0322L28.3536 40.5469L27.4875 40.047ZM23.1661 44.5324L24.0321 44.0323L21.4419 39.5468L20.5759 40.0469L19.71 40.5469L22.3001 45.0324L23.1661 44.5324ZM19.9256 39.5646L20.1659 38.5939C13.1788 36.8641 8 30.5523 8 23.0322H7H6C6 31.4935 11.827 38.5898 19.6853 40.5353L19.9256 39.5646ZM7 23.0322H8C8 14.1779 15.1779 7 24.0322 7V6V5C14.0733 5 6 13.0733 6 23.0322H7ZM20.5759 40.0469L21.4419 39.5468C21.1584 39.0558 20.6883 38.7232 20.1659 38.5939L19.9256 39.5646L19.6853 40.5353C19.6958 40.5378 19.7031 40.5419 19.7072 40.5449C19.711 40.5477 19.711 40.5488 19.71 40.5469L20.5759 40.0469ZM24.8982 44.5323L24.0321 44.0323L23.1661 44.5324L22.3001 45.0324C23.07 46.3657 24.9945 46.3656 25.7642 45.0322L24.8982 44.5323ZM28.138 39.5646L27.8977 38.5938C27.3752 38.7232 26.905 39.0559 26.6215 39.547L27.4875 40.047L28.3536 40.5469C28.3525 40.5488 28.3525 40.5477 28.3563 40.5449C28.3604 40.5419 28.3677 40.5379 28.3782 40.5353L28.138 39.5646Z" fill="white" mask="url(#path-1-outside-1_1669_107)"/>
        </g>
        <path d="M25.0784 14.8506C24.6468 14.5388 24.0639 14.5388 23.6323 14.8506L17.4577 19.31C17.1362 19.5422 16.9458 19.9146 16.9458 20.3111V29.1475C16.9458 29.8295 17.4987 30.3824 18.1807 30.3824H20.3418C21.0239 30.3824 21.5768 29.8295 21.5768 29.1475V25.3741C21.5768 24.6921 22.1297 24.1392 22.8117 24.1392H25.899C26.581 24.1392 27.1339 24.6921 27.1339 25.3741V29.1475C27.1339 29.8295 27.6868 30.3824 28.3689 30.3824H30.53C31.212 30.3824 31.7649 29.8295 31.7649 29.1475V20.3111C31.7649 19.9146 31.5745 19.5422 31.253 19.31L25.0784 14.8506Z" fill="white"/>
        <defs>
          <filter id="filter0_d_1669_107" x="0.838709" y="0.870968" width="46.387" height="51.3548" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.03226"/>
            <feGaussianBlur stdDeviation="2.58065"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1669_107"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1669_107" result="shape"/>
          </filter>
        </defs>
      </svg>`,
    책갈피: `<svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1659_1699)">
          <mask id="path-1-outside-1_1659_1699" maskUnits="userSpaceOnUse" x="6" y="5" width="37" height="42" fill="black">
            <rect fill="white" x="6" y="5" width="37" height="42"/>
            <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z"/>
          </mask>
          <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z" fill="#08A758"/>
          <path d="M19.9256 39.5646L19.6853 40.5353L19.9256 39.5646ZM24.8982 44.5323L24.0321 44.0323L24.8982 44.5323ZM23.1661 44.5324L24.0321 44.0323L23.1661 44.5324ZM28.138 39.5646L28.3782 40.5353L28.138 39.5646ZM27.4875 40.047L28.3536 40.5469L27.4875 40.047ZM24.0322 6V7C32.8866 7 40.0645 14.1779 40.0645 23.0322H41.0645H42.0645C42.0645 13.0733 33.9912 5 24.0322 5V6ZM41.0645 23.0322H40.0645C40.0645 30.5526 34.8852 36.8643 27.8977 38.5938L28.138 39.5646L28.3782 40.5353C36.2369 38.5901 42.0645 31.4939 42.0645 23.0322H41.0645ZM27.4875 40.047L26.6215 39.547L24.0321 44.0323L24.8982 44.5323L25.7642 45.0322L28.3536 40.5469L27.4875 40.047ZM23.1661 44.5324L24.0321 44.0323L21.4419 39.5468L20.5759 40.0469L19.71 40.5469L22.3001 45.0324L23.1661 44.5324ZM19.9256 39.5646L20.1659 38.5939C13.1788 36.8641 8 30.5523 8 23.0322H7H6C6 31.4935 11.827 38.5898 19.6853 40.5353L19.9256 39.5646ZM7 23.0322H8C8 14.1779 15.1779 7 24.0322 7V6V5C14.0733 5 6 13.0733 6 23.0322H7ZM20.5759 40.0469L21.4419 39.5468C21.1584 39.0558 20.6883 38.7232 20.1659 38.5939L19.9256 39.5646L19.6853 40.5353C19.6958 40.5378 19.7031 40.5419 19.7072 40.5449C19.711 40.5477 19.711 40.5488 19.71 40.5469L20.5759 40.0469ZM24.8982 44.5323L24.0321 44.0323L23.1661 44.5324L22.3001 45.0324C23.07 46.3657 24.9945 46.3656 25.7642 45.0322L24.8982 44.5323ZM28.138 39.5646L27.8977 38.5938C27.3752 38.7232 26.905 39.0559 26.6215 39.547L27.4875 40.047L28.3536 40.5469C28.3525 40.5488 28.3525 40.5477 28.3563 40.5449C28.3604 40.5419 28.3677 40.5379 28.3782 40.5353L28.138 39.5646Z" fill="white" mask="url(#path-1-outside-1_1659_1699)"/>
        </g>
        <path d="M17.5537 15.7101C17.5537 15.0805 18.0641 14.5701 18.6937 14.5701H28.9537C29.5833 14.5701 30.0937 15.0805 30.0937 15.7101V28.6604C30.0937 29.5139 29.1904 30.0647 28.4316 29.6739L24.3458 27.569C24.0182 27.4003 23.6292 27.4003 23.3016 27.569L19.2158 29.6739C18.4571 30.0647 17.5537 29.5139 17.5537 28.6604V15.7101Z" fill="white"/>
        <defs>
          <filter id="filter0_d_1659_1699" x="0.838709" y="0.870968" width="46.387" height="51.3548" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.03226"/>
            <feGaussianBlur stdDeviation="2.58065"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1659_1699"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1659_1699" result="shape"/>
          </filter>
        </defs>
      </svg>`,
  };
};

const createTouristMarkerImages = () => {
  return {
    관광지: `<svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1667_1523)">
          <mask id="path-1-outside-1_1667_1523" maskUnits="userSpaceOnUse" x="6" y="5" width="37" height="42" fill="black">
            <rect fill="white" x="6" y="5" width="37" height="42"/>
            <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z"/>
          </mask>
          <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z" fill="#08A758"/>
          <path d="M19.9256 39.5646L19.6853 40.5353L19.9256 39.5646ZM24.8982 44.5323L24.0321 44.0323L24.8982 44.5323ZM23.1661 44.5324L24.0321 44.0323L23.1661 44.5324ZM28.138 39.5646L28.3782 40.5353L28.138 39.5646ZM27.4875 40.047L28.3536 40.5469L27.4875 40.047ZM24.0322 6V7C32.8866 7 40.0645 14.1779 40.0645 23.0322H41.0645H42.0645C42.0645 13.0733 33.9912 5 24.0322 5V6ZM41.0645 23.0322H40.0645C40.0645 30.5526 34.8852 36.8643 27.8977 38.5938L28.138 39.5646L28.3782 40.5353C36.2369 38.5901 42.0645 31.4939 42.0645 23.0322H41.0645ZM27.4875 40.047L26.6215 39.547L24.0321 44.0323L24.8982 44.5323L25.7642 45.0322L28.3536 40.5469L27.4875 40.047ZM23.1661 44.5324L24.0321 44.0323L21.4419 39.5468L20.5759 40.0469L19.71 40.5469L22.3001 45.0324L23.1661 44.5324ZM19.9256 39.5646L20.1659 38.5939C13.1788 36.8641 8 30.5523 8 23.0322H7H6C6 31.4935 11.827 38.5898 19.6853 40.5353L19.9256 39.5646ZM7 23.0322H8C8 14.1779 15.1779 7 24.0322 7V6V5C14.0733 5 6 13.0733 6 23.0322H7ZM20.5759 40.0469L21.4419 39.5468C21.1584 39.0558 20.6883 38.7232 20.1659 38.5939L19.9256 39.5646L19.6853 40.5353C19.6958 40.5378 19.7031 40.5419 19.7072 40.5449C19.711 40.5477 19.711 40.5488 19.71 40.5469L20.5759 40.0469ZM24.8982 44.5323L24.0321 44.0323L23.1661 44.5324L22.3001 45.0324C23.07 46.3657 24.9945 46.3656 25.7642 45.0322L24.8982 44.5323ZM28.138 39.5646L27.8977 38.5938C27.3752 38.7232 26.905 39.0559 26.6215 39.547L27.4875 40.047L28.3536 40.5469C28.3525 40.5488 28.3525 40.5477 28.3563 40.5449C28.3604 40.5419 28.3677 40.5379 28.3782 40.5353L28.138 39.5646Z" fill="white" mask="url(#path-1-outside-1_1667_1523)"/>
        </g>
        <path d="M31.0834 18.0639C31.3428 17.4414 30.8854 16.7554 30.2111 16.7554H19.7063C19.2215 16.7554 18.8286 16.3625 18.8286 15.8777V15.8777C18.8286 15.393 18.4356 15 17.9509 15H17.9143C17.4093 15 17 15.4093 17 15.9143V31.64C17 32.145 17.4093 32.5543 17.9143 32.5543V32.5543C18.4192 32.5543 18.8286 32.145 18.8286 31.64V26.4776C18.8286 25.9557 19.2517 25.5326 19.7736 25.5326H30.2111C30.8854 25.5326 31.3428 24.8466 31.0834 24.2241L29.9515 21.5075C29.8545 21.2749 29.8545 21.0132 29.9515 20.7806L31.0834 18.0639ZM26.1429 21.144C26.1429 22.1095 25.32 22.8994 24.3143 22.8994C23.3086 22.8994 22.4857 22.1095 22.4857 21.144C22.4857 20.1785 23.3086 19.3886 24.3143 19.3886C25.32 19.3886 26.1429 20.1785 26.1429 21.144Z" fill="white"/>
        <defs>
          <filter id="filter0_d_1667_1523" x="0.838709" y="0.870968" width="46.387" height="51.3548" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.03226"/>
            <feGaussianBlur stdDeviation="2.58065"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1667_1523"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1667_1523" result="shape"/>
          </filter>
        </defs>
      </svg>`,
    축제: `<svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1659_1686)">
          <mask id="path-1-outside-1_1659_1686" maskUnits="userSpaceOnUse" x="6" y="5" width="37" height="42" fill="black">
            <rect fill="white" x="6" y="5" width="37" height="42"/>
            <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z"/>
          </mask>
          <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z" fill="#08A758"/>
          <path d="M19.9256 39.5646L19.6853 40.5353L19.9256 39.5646ZM24.8982 44.5323L24.0321 44.0323L24.8982 44.5323ZM23.1661 44.5324L24.0321 44.0323L23.1661 44.5324ZM28.138 39.5646L28.3782 40.5353L28.138 39.5646ZM27.4875 40.047L28.3536 40.5469L27.4875 40.047ZM24.0322 6V7C32.8866 7 40.0645 14.1779 40.0645 23.0322H41.0645H42.0645C42.0645 13.0733 33.9912 5 24.0322 5V6ZM41.0645 23.0322H40.0645C40.0645 30.5526 34.8852 36.8643 27.8977 38.5938L28.138 39.5646L28.3782 40.5353C36.2369 38.5901 42.0645 31.4939 42.0645 23.0322H41.0645ZM27.4875 40.047L26.6215 39.547L24.0321 44.0323L24.8982 44.5323L25.7642 45.0322L28.3536 40.5469L27.4875 40.047ZM23.1661 44.5324L24.0321 44.0323L21.4419 39.5468L20.5759 40.0469L19.71 40.5469L22.3001 45.0324L23.1661 44.5324ZM19.9256 39.5646L20.1659 38.5939C13.1788 36.8641 8 30.5523 8 23.0322H7H6C6 31.4935 11.827 38.5898 19.6853 40.5353L19.9256 39.5646ZM7 23.0322H8C8 14.1779 15.1779 7 24.0322 7V6V5C14.0733 5 6 13.0733 6 23.0322H7ZM20.5759 40.0469L21.4419 39.5468C21.1584 39.0558 20.6883 38.7232 20.1659 38.5939L19.9256 39.5646L19.6853 40.5353C19.6958 40.5378 19.7031 40.5419 19.7072 40.5449C19.711 40.5477 19.711 40.5488 19.71 40.5469L20.5759 40.0469ZM24.8982 44.5323L24.0321 44.0323L23.1661 44.5324L22.3001 45.0324C23.07 46.3657 24.9945 46.3656 25.7642 45.0322L24.8982 44.5323ZM28.138 39.5646L27.8977 38.5938C27.3752 38.7232 26.905 39.0559 26.6215 39.547L27.4875 40.047L28.3536 40.5469C28.3525 40.5488 28.3525 40.5477 28.3563 40.5449C28.3604 40.5419 28.3677 40.5379 28.3782 40.5353L28.138 39.5646Z" fill="white" mask="url(#path-1-outside-1_1659_1686)"/>
        </g>
        <path d="M24.7393 24.5449L22.6786 26.5669C22.1368 27.1087 21.8369 27.815 21.8369 28.5696C21.8369 30.1369 23.143 31.414 24.7393 31.414C26.3357 31.414 27.6418 30.1369 27.6418 28.5696C27.6418 27.815 27.3418 27.0991 26.8001 26.5669L24.7393 24.5449Z" fill="white"/>
        <path d="M28.6097 17.8699L28.184 18.402C27.0424 19.8242 24.7398 19.0212 24.7398 17.1927V14C24.7398 14 17 17.8699 17 24.6422C17 27.4672 18.5093 29.9343 20.7635 31.2791C20.2217 30.5148 19.9024 29.5763 19.9024 28.5702C19.9024 27.2931 20.4055 26.0934 21.3246 25.184L24.7398 21.8365L28.155 25.1937C29.0741 26.0934 29.5772 27.2931 29.5772 28.5798C29.5772 29.5667 29.2773 30.4761 28.7548 31.2404C30.5833 30.1278 31.9378 28.2799 32.3442 26.1128C32.9827 22.6782 31.309 19.4372 28.6097 17.8699Z" fill="white"/>
        <defs>
          <filter id="filter0_d_1659_1686" x="0.838709" y="0.870968" width="46.387" height="51.3548" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.03226"/>
            <feGaussianBlur stdDeviation="2.58065"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1659_1686"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1659_1686" result="shape"/>
          </filter>
        </defs>
      </svg>`,
    맛집: `<svg width="48" height="53" viewBox="0 0 48 53" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1669_106)">
          <mask id="path-1-outside-1_1669_106" maskUnits="userSpaceOnUse" x="6" y="5" width="37" height="42" fill="black">
            <rect fill="white" x="6" y="5" width="37" height="42"/>
            <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z"/>
          </mask>
          <path d="M24.0322 6C33.4389 6 41.0645 13.6256 41.0645 23.0322C41.0645 31.0232 35.5611 37.7272 28.138 39.5646C27.8652 39.6321 27.628 39.8037 27.4875 40.047L24.8982 44.5323C24.5133 45.1989 23.5511 45.199 23.1661 44.5324L20.5759 40.0469C20.4355 39.8036 20.1983 39.6321 19.9256 39.5646C12.5029 37.7269 7 31.0229 7 23.0322C7 13.6256 14.6256 6 24.0322 6Z" fill="#08A758"/>
          <path d="M19.9256 39.5646L19.6853 40.5353L19.9256 39.5646ZM24.8982 44.5323L24.0321 44.0323L24.8982 44.5323ZM23.1661 44.5324L24.0321 44.0323L23.1661 44.5324ZM28.138 39.5646L28.3782 40.5353L28.138 39.5646ZM27.4875 40.047L28.3536 40.5469L27.4875 40.047ZM24.0322 6V7C32.8866 7 40.0645 14.1779 40.0645 23.0322H41.0645H42.0645C42.0645 13.0733 33.9912 5 24.0322 5V6ZM41.0645 23.0322H40.0645C40.0645 30.5526 34.8852 36.8643 27.8977 38.5938L28.138 39.5646L28.3782 40.5353C36.2369 38.5901 42.0645 31.4939 42.0645 23.0322H41.0645ZM27.4875 40.047L26.6215 39.547L24.0321 44.0323L24.8982 44.5323L25.7642 45.0322L28.3536 40.5469L27.4875 40.047ZM23.1661 44.5324L24.0321 44.0323L21.4419 39.5468L20.5759 40.0469L19.71 40.5469L22.3001 45.0324L23.1661 44.5324ZM19.9256 39.5646L20.1659 38.5939C13.1788 36.8641 8 30.5523 8 23.0322H7H6C6 31.4935 11.827 38.5898 19.6853 40.5353L19.9256 39.5646ZM7 23.0322H8C8 14.1779 15.1779 7 24.0322 7V6V5C14.0733 5 6 13.0733 6 23.0322H7ZM20.5759 40.0469L21.4419 39.5468C21.1584 39.0558 20.6883 38.7232 20.1659 38.5939L19.9256 39.5646L19.6853 40.5353C19.6958 40.5378 19.7031 40.5419 19.7072 40.5449C19.711 40.5477 19.711 40.5488 19.71 40.5469L20.5759 40.0469ZM24.8982 44.5323L24.0321 44.0323L23.1661 44.5324L22.3001 45.0324C23.07 46.3657 24.9945 46.3656 25.7642 45.0322L24.8982 44.5323ZM28.138 39.5646L27.8977 38.5938C27.3752 38.7232 26.905 39.0559 26.6215 39.547L27.4875 40.047L28.3536 40.5469C28.3525 40.5488 28.3525 40.5477 28.3563 40.5449C28.3604 40.5419 28.3677 40.5379 28.3782 40.5353L28.138 39.5646Z" fill="white" mask="url(#path-1-outside-1_1669_106)"/>
        </g>
        <path d="M32.528 23.514C32.528 18.8143 28.7137 15 24.014 15C19.3143 15 15.5 18.8143 15.5 23.514C15.5 26.6557 17.603 29.3546 20.6084 30.5381V32.028H27.4196V30.5381C30.425 29.3546 32.528 26.6557 32.528 23.514ZM30.8252 23.514H27.4196V17.6223C29.4544 18.8058 30.8252 21.0024 30.8252 23.514ZM25.7168 16.9242V23.514H22.3112V16.9242C22.8561 16.7879 23.4265 16.7028 24.014 16.7028C24.6015 16.7028 25.1719 16.7879 25.7168 16.9242ZM17.2028 23.514C17.2028 21.0024 18.5736 18.8058 20.6084 17.6223V23.514H17.2028Z" fill="white"/>
        <defs>
          <filter id="filter0_d_1669_106" x="0.838709" y="0.870968" width="46.387" height="51.3548" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1.03226"/>
            <feGaussianBlur stdDeviation="2.58065"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1669_106"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1669_106" result="shape"/>
          </filter>
        </defs>
      </svg>
`,
  };
};

// 마커 스타일
const markerStyles = {
  width: 24,
  height: 24,
};

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  regions?: string[];
};

interface Bookstore {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface WebViewMessage {
  type: string;
  id?: number;
  name?: string;
  lat?: number;
  lng?: number;
}

export interface KakaoMapRef {
  postMessage: (message: string) => void;
  addBookstoreMarker: (bookstore: Bookstore) => void;
  addAllBookstores: () => void;
  clearAllMarkers: () => void;
  showMyLocationMarker: () => void;
  moveToLocation: (latitude: number, longitude: number) => void;
}

// 대한민국 남한 경계 좌표 (최대/최소 위도, 경도)
const koreaBounds = {
  north: 38.6, // 최북단 (강원도 철원)
  south: 33.0, // 최남단 (제주도)
  east: 132.0, // 최동단 (울릉도)
  west: 124.5, // 최서단 (서해안)
};

// 지역별 좌표 데이터
const regionCoordinates = {
  강릉: { lat: 37.7519, lng: 128.8759 },
  양구: { lat: 38.1074, lng: 127.9892 },
  태백: { lat: 37.1641, lng: 128.9856 },
  평창: { lat: 37.3705, lng: 128.39 },
  횡성: { lat: 37.4868, lng: 127.9852 },
  원주: { lat: 37.3441, lng: 127.92 },
  춘천: { lat: 37.8228, lng: 127.7322 },
  양양: { lat: 38.0754, lng: 128.6189 },
  속초: { lat: 38.1667, lng: 128.5833 },
  영월: { lat: 37.1837, lng: 128.4615 },
  정선: { lat: 37.3807, lng: 128.66 },
  철원: { lat: 38.1466, lng: 127.3132 },
  화천: { lat: 38.1065, lng: 127.7062 },
  인제: { lat: 38.0685, lng: 128.17 },
  고성: { lat: 38.3785, lng: 128.4675 },
  동해: { lat: 37.5236, lng: 129.1144 },
  삼척: { lat: 37.45, lng: 129.1667 },
};

const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(
  ({ latitude, longitude, regions = [] }, ref) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;

    // 활성화된 마커 ID 관리 (한 번에 하나만 활성화)
    const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

    // activeMarkerId가 변경될 때마다 모든 마커를 다시 그리기
    useEffect(() => {
      if (webViewRef.current) {
        console.log(
          "activeMarkerId 변경됨:",
          activeMarkerId,
          "마커 재렌더링 시작",
        );
        // 마커 이미지만 업데이트하고 기존 마커는 제거하지 않음
        setTimeout(() => {
          bookstores.forEach((bookstore) => {
            updateBookstoreMarkerImage(bookstore);
          });
        }, 100);
      }
    }, [activeMarkerId]);

    // 문화/서점 마커들
    const culturalMarkers = useMemo(() => {
      return createCulturalMarkerImages();
    }, []);

    // 관광/음식 마커들
    const touristMarkers = useMemo(() => {
      return createTouristMarkerImages();
    }, []);

    // 샘플 독립서점 데이터
    const bookstores: Bookstore[] = [
      {
        id: 1,
        name: "강릉 독립서점",
        lat: 37.7519,
        lng: 128.8759,
      },
      {
        id: 2,
        name: "춘천 북카페",
        lat: 37.8228,
        lng: 127.7322,
      },
      {
        id: 3,
        name: "속초 책방",
        lat: 38.1667,
        lng: 128.5833,
      },
      {
        id: 4,
        name: "원주 서점",
        lat: 37.3441,
        lng: 127.92,
      },
    ];

    const webViewRef = React.useRef<WebView>(null);

    // 문화/서점 마커 추가 (모든 마커 동일한 크기 사용)
    const addCulturalMarker = (bookstore: Bookstore) => {
      const isActive = activeMarkerId === bookstore.id;
      const imageData = isActive
        ? culturalMarkers.독립서점
        : culturalMarkers.독립서점;

      const message = {
        type: "addCulturalMarker",
        id: bookstore.id,
        name: bookstore.name,
        lat: bookstore.lat,
        lng: bookstore.lng,
        imageData: imageData,
        width: markerStyles.width,
        height: markerStyles.height,
        isActive: isActive,
      };

      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 모든 문화/서점 마커 추가
    const addAllCulturalMarkers = () => {
      bookstores.forEach((bookstore) => {
        addCulturalMarker(bookstore);
      });
    };

    // 기존 마커의 이미지만 업데이트 (마커 제거하지 않음)
    const updateBookstoreMarkerImage = (bookstore: Bookstore) => {
      const message = {
        type: "updateBookstoreMarkerImage",
        id: bookstore.id,
        isActive: activeMarkerId === bookstore.id,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 내 위치 마커 표시 (항상 표시)
    const showMyLocationMarker = () => {
      const message = {
        type: "showMyLocationMarker",
        latitude: latitude,
        longitude: longitude,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 지도를 특정 위치로 이동
    const moveToLocation = (newLatitude: number, newLongitude: number) => {
      const message = {
        type: "moveToLocation",
        latitude: newLatitude,
        longitude: newLongitude,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 모든 마커 제거
    const clearAllMarkers = () => {
      setActiveMarkerId(null);
      const message = { type: "clearAllMarkers" };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 웹뷰에서 메시지 받기
    const handleMessage = (event: any) => {
      try {
        const data: WebViewMessage = JSON.parse(event.nativeEvent.data);

        if (data.type === "bookstoreClick") {
          const markerId = data.id!;
          console.log("독립서점 마커 클릭됨:", markerId);

          // 현재 활성화된 마커와 다른 마커인 경우 활성화
          if (activeMarkerId !== markerId) {
            setActiveMarkerId(markerId);
            console.log("활성 마커 ID 설정됨:", markerId);
            // useEffect가 자동으로 마커를 다시 그림
          }
        } else if (data.type === "mapClicked") {
          // 지도 클릭 시 모든 마커 비활성화
          setActiveMarkerId(null);
          // clearAllMarkers() 제거 - useEffect가 자동으로 마커 상태 업데이트
          // useEffect가 자동으로 마커를 다시 그림
        } else if (data.type === "mapReady") {
          // 지도가 완전히 로드된 후 내 위치 마커 표시
          console.log("Map is ready, showing my location marker");
          showMyLocationMarker();
        } else if (data.type === "console") {
          console.log("WebView Console:", data);
        }
      } catch (error) {
        console.log("메시지 파싱 오류:", error);
      }
    };

    // HTML 내용
    const htmlContent = useMemo(() => {
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services"></script>
          <style>
            body { margin: 0; padding: 0; height: 100%; }
            html { height: 100%; }
            #map { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map;
            let regionMarkers = [];
            let bookstoreMarkers = {};
            let myLocationMarker = null;
            
            // 전역 변수들을 안전하게 초기화
            if (typeof window.activeImageData === 'undefined') {
              window.activeImageData = null;
            }
            if (typeof window.inactiveImageData === 'undefined') {
              window.inactiveImageData = null;
            }
            if (typeof window.myLocationRetryCount === 'undefined') {
              window.myLocationRetryCount = 0;
            }
            
            // 콘솔 로그를 React Native로 전송 (Hermes 호환성 개선)
            if (typeof console !== 'undefined' && console.log) {
              const originalConsoleLog = console.log;
              try {
                console.log = function(...args) {
                  originalConsoleLog.apply(console, args);
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'console',
                      message: args.join(' ')
                    }));
                  }
                };
              } catch (e) {
                // console.log 재정의가 실패하면 원본 사용
                console.log('Console log override failed, using original');
              }
            }
            
            window.onload = function() {
              console.log('Kakao Map API Loaded');
              if (typeof kakao !== 'undefined' && kakao.maps) {
                console.log('Kakao Maps is available');
                const mapContainer = document.getElementById('map');
                
                // 초기 좌표를 대한민국 범위 내로 제한
                const initialLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, ${latitude}));
                const initialLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, ${longitude}));
                
                const mapOption = {
                  center: new kakao.maps.LatLng(initialLat, initialLng),
                  level: 7
                };
                map = new kakao.maps.Map(mapContainer, mapOption);
                
                // 지도 범위 제한 설정
                const southWest = new kakao.maps.LatLng(${koreaBounds.south}, ${koreaBounds.west});
                const northEast = new kakao.maps.LatLng(${koreaBounds.north}, ${koreaBounds.east});
                const bounds = new kakao.maps.LatLngBounds(southWest, northEast);
                
                // 지도 범위 제한 적용
                map.setMaxBounds(bounds);
                console.log('지도 범위가 대한민국 남한으로 제한됨');

                // 지도 로드 완료 이벤트 리스너 추가
                kakao.maps.event.addListener(map, 'tilesloaded', function() {
                  console.log('Map tiles loaded - map is fully ready');
                  
                  // 지도가 완전히 로드된 후 내 위치 마커 생성
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapReady'
                    }));
                  }
                });

                // 선택된 지역들의 마커 추가
                const selectedRegions = ${JSON.stringify(regions)};
                const regionCoords = ${JSON.stringify(regionCoordinates)};
                
                selectedRegions.forEach(regionName => {
                  if (regionCoords[regionName]) {
                    const coords = regionCoords[regionName];
                    const markerPosition = new kakao.maps.LatLng(coords.lat, coords.lng);
                    
                    const marker = new kakao.maps.Marker({
                      position: markerPosition
                    });
                    
                    marker.setMap(map);
                    regionMarkers.push(marker);
                    
                    const infowindow = new kakao.maps.InfoWindow({
                      content: '<div style="padding:8px;font-size:14px;font-weight:bold;">' + regionName + '</div>'
                    });
                    
                    kakao.maps.event.addListener(marker, 'click', function() {
                      infowindow.open(map, marker);
                    });
                  }
                });
                
                // 지역 마커들이 모두 보이도록 지도 범위 조정
                if (regionMarkers.length > 0) {
                  const bounds = new kakao.maps.LatLngBounds();
                  regionMarkers.forEach(marker => {
                    bounds.extend(marker.getPosition());
                  });
                  map.setBounds(bounds);
                }
                
                console.log('Map initialized successfully');
                
                // 지도 클릭 시 모든 마커 비활성화
                kakao.maps.event.addListener(map, 'click', function() {
                  console.log('Map clicked, deactivating all markers');
                  
                  // React Native로 지도 클릭 메시지 전송 (인포박스는 activeMarkerId 변경으로 자동 처리)
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapClicked'
                    }));
                  }
                });
                
                // 지도 이동 시 범위 제한 확인
                kakao.maps.event.addListener(map, 'bounds_changed', function() {
                  const center = map.getCenter();
                  const lat = center.getLat();
                  const lng = center.getLng();
                  
                  // 범위를 벗어난 경우 자동으로 범위 내로 조정
                  if (lat < ${koreaBounds.south} || lat > ${koreaBounds.north} || 
                      lng < ${koreaBounds.west} || lng > ${koreaBounds.east}) {
                    const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                    const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                    
                    console.log('지도가 범위를 벗어남, 자동 조정:', { original: [lat, lng], adjusted: [restrictedLat, restrictedLng] });
                    map.setCenter(new kakao.maps.LatLng(restrictedLat, restrictedLng));
                  }
                });
              } else {
                console.error('Kakao Maps is not available');
              }
            };

            // 독립서점 마커 추가 함수
            function addBookstoreMarkerToMap(id, name, lat, lng, imageData, width, height, isActive) {
              console.log('Adding bookstore marker:', name, 'active:', isActive);
              
              // 기존 마커 제거
              if (bookstoreMarkers[id]) {
                bookstoreMarkers[id].marker.setMap(null);
                if (bookstoreMarkers[id].infowindow) {
                  bookstoreMarkers[id].infowindow.close();
                }
              }

              const markerPosition = new kakao.maps.LatLng(lat, lng);
              let marker;
              
              // 커스텀 이미지 마커 생성
              if (imageData && imageData.length > 0) {
                try {
                  const imageSize = new kakao.maps.Size(width, height);
                  const imageOption = {
                    offset: new kakao.maps.Point(width / 2, height)
                  };
                  
                  const markerImage = new kakao.maps.MarkerImage(imageData, imageSize, imageOption);
                  
                  marker = new kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage,
                    title: name
                  });
                  
                  console.log('Custom marker created successfully');
                } catch (error) {
                  console.error('Error creating custom marker:', error);
                  // 기본 마커로 폴백
                  marker = new kakao.maps.Marker({
                    position: markerPosition,
                    title: name
                  });
                }
              } else {
                marker = new kakao.maps.Marker({
                  position: markerPosition,
                  title: name
                });
              }
              
              marker.setMap(map);

              // 인포윈도우 생성 (활성/비활성 상태 표시)
              const infowindow = new kakao.maps.InfoWindow({
                content: '<div style="padding:10px;font-size:14px;text-align:center;min-width:120px;"><strong>' + name + '</strong></div>'
              });

              // 마커 클릭 이벤트
              kakao.maps.event.addListener(marker, 'click', function() {
                // React Native로 메시지 전송 (인포박스는 activeMarkerId 변경으로 자동 처리)
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'bookstoreClick',
                    id: id,
                    name: name,
                    lat: lat,
                    lng: lng
                  }));
                }
              });

              // 마커 정보 저장
              bookstoreMarkers[id] = {
                marker: marker,
                infowindow: infowindow,
                name: name,
                lat: lat,
                lng: lng,
                isActive: isActive
              };
              
              console.log('Bookstore marker added successfully:', name);
            }

            // 내 위치 마커 표시 (항상 표시)
            function showMyLocationMarker(lat, lng) {
              try {
                // 지도가 준비되지 않았으면 대기
                if (!map) {
                  console.log('Map not ready, waiting...');
                  setTimeout(() => showMyLocationMarker(lat, lng), 100);
                  return;
                }
                
                // 좌표 유효성 검사
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  console.error('Invalid coordinates:', lat, lng);
                  return;
                }
                
                // 대한민국 남한 범위 내로 좌표 제한
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                // 범위가 제한된 경우 로그 출력
                if (restrictedLat !== lat || restrictedLng !== lng) {
                  console.log('내 위치 마커 좌표가 대한민국 범위로 제한됨:', { original: [lat, lng], restricted: [restrictedLat, restrictedLng] });
                }
                
                // 제한된 좌표 사용
                const finalLat = restrictedLat;
                const finalLng = restrictedLng;
                
                // 기존 내 위치 마커가 있으면 위치만 업데이트 (제거하지 않음)
                if (myLocationMarker) {
                  const currentPos = myLocationMarker.getPosition();
                  const newPos = new kakao.maps.LatLng(finalLat, finalLng);
                  
                  // 위치가 같으면 업데이트하지 않음
                  if (Math.abs(currentPos.getLat() - finalLat) < 0.0001 && 
                      Math.abs(currentPos.getLng() - finalLng) < 0.0001) {
                    console.log('내 위치 마커가 이미 같은 위치에 있음, 업데이트 생략');
                    return;
                  }
                  
                  // 위치만 업데이트
                  myLocationMarker.setPosition(newPos);
                  console.log('기존 내 위치 마커 위치 업데이트됨:', finalLat, finalLng);
                  return;
                }
                
                // 새로운 내 위치 마커 생성 (카카오맵 기본 내 위치 마커)
                const myLocationPosition = new kakao.maps.LatLng(finalLat, finalLng);
                myLocationMarker = new kakao.maps.Marker({
                  position: myLocationPosition,
                  map: map
                });
                
                // 마커가 성공적으로 생성되었는지 확인
                if (myLocationMarker && myLocationMarker.getMap()) {
                  console.log('내 위치 마커 표시됨:', finalLat, finalLng);
                } else {
                  console.error('마커 생성 실패');
                  throw new Error('마커 생성 실패');
                }
              } catch (error) {
                console.error('내 위치 마커 생성 실패:', error);
                // 에러 발생 시 재시도 (최대 3번)
                if (typeof window.myLocationRetryCount === 'undefined') {
                  window.myLocationRetryCount = 0;
                }
                if (window.myLocationRetryCount < 3) {
                  window.myLocationRetryCount++;
                  console.log('재시도 중...', window.myLocationRetryCount);
                  setTimeout(() => showMyLocationMarker(lat, lng), 500);
                } else {
                  console.error('최대 재시도 횟수 초과');
                  window.myLocationRetryCount = 0;
                }
              }
            }

            // 지도를 특정 위치로 이동
            function moveMapToLocation(lat, lng) {
              try {
                if (!map) {
                  console.log('Map not ready for moving, waiting...');
                  setTimeout(() => moveMapToLocation(lat, lng), 100);
                  return;
                }
                
                // 좌표 유효성 검사
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  console.error('Invalid coordinates for map move:', lat, lng);
                  return;
                }
                
                // 대한민국 남한 범위 내로 좌표 제한
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                // 범위가 제한된 경우 로그 출력
                if (restrictedLat !== lat || restrictedLng !== lng) {
                  console.log('좌표가 대한민국 범위로 제한됨:', { original: [lat, lng], restricted: [restrictedLat, restrictedLng] });
                }
                
                const newPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                map.setCenter(newPosition);
                console.log('지도가 다음 위치로 이동됨:', restrictedLat, restrictedLng);
                
                // 내 위치 마커가 이미 있으면 위치만 업데이트, 없으면 새로 생성
                if (myLocationMarker) {
                  myLocationMarker.setPosition(newPosition);
                  console.log('기존 내 위치 마커 위치 업데이트됨');
                } else {
                  // 마커가 없으면 새로 생성
                  showMyLocationMarker(restrictedLat, restrictedLng);
                }
              } catch (error) {
                console.error('지도 이동 실패:', error);
              }
            }

            // 기존 마커의 이미지와 인포박스 상태 업데이트
            function updateBookstoreMarkerImage(id, isActive) {
              if (bookstoreMarkers[id]) {
                const marker = bookstoreMarkers[id].marker;
                const infowindow = bookstoreMarkers[id].infowindow;
                const name = bookstoreMarkers[id].name;
                
                // 활성/비활성 상태에 따라 이미지 변경
                const imageData = isActive ? window.activeImageData : window.inactiveImageData;
                const width = ${markerStyles.width};
                const height = ${markerStyles.height};
                
                try {
                  const imageSize = new kakao.maps.Size(width, height);
                  const imageOption = {
                    offset: new kakao.maps.Point(width / 2, height)
                  };
                  
                  const markerImage = new kakao.maps.MarkerImage(imageData, imageSize, imageOption);
                  marker.setImage(markerImage);
                  
                  // 활성 상태에 따라 인포박스 표시/숨김
                  if (isActive) {
                    // 다른 모든 인포박스 닫기
                    Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                      if (bookstoreMarker.infowindow) {
                        bookstoreMarker.infowindow.close();
                      }
                    });
                    // 현재 마커의 인포박스 열기
                    infowindow.open(map, marker);
                    console.log('인포박스 열림:', name);
                  } else {
                    // 비활성 상태면 인포박스 닫기
                    infowindow.close();
                    console.log('인포박스 닫힘:', name);
                  }
                  
                  console.log('마커 이미지 및 인포박스 업데이트됨:', name, 'active:', isActive);
                } catch (error) {
                  console.error('마커 이미지 및 인포박스 업데이트 실패:', error);
                }
              }
            }

            // 모든 독립서점 마커 제거
            function clearAllBookstoreMarkers() {
              console.log('Clearing all bookstore markers');
              Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                bookstoreMarker.marker.setMap(null);
                if (bookstoreMarker.infowindow) {
                  bookstoreMarker.infowindow.close();
                }
              });
              bookstoreMarkers = {};
              console.log('All bookstore markers cleared');
            }

            // React Native에서 메시지 받기
            window.addEventListener('message', function(event) {
              try {
                const data = JSON.parse(event.data);
                console.log('Received message from React Native:', data.type);
                
                if (data.type === 'addBookstoreMarker') {
                  // 첫 번째 마커 추가 시 활성/비활성 이미지 데이터 저장
                  if (!window.activeImageData || !window.inactiveImageData) {
                    try {
                      window.activeImageData = data.imageData;
                      window.inactiveImageData = data.imageData; // 현재는 같은 이미지 사용
                      console.log('활성/비활성 이미지 데이터 저장됨');
                    } catch (e) {
                      console.error('이미지 데이터 저장 실패:', e);
                    }
                  }
                  
                  addBookstoreMarkerToMap(
                    data.id, 
                    data.name, 
                    data.lat, 
                    data.lng, 
                    data.imageData, 
                    data.width, 
                    data.height,
                    data.isActive
                  );
                } else if (data.type === 'showMyLocationMarker') {
                  showMyLocationMarker(data.latitude, data.longitude);
                } else if (data.type === 'updateBookstoreMarkerImage') {
                  updateBookstoreMarkerImage(data.id, data.isActive);
                } else if (data.type === 'moveToLocation') {
                  moveMapToLocation(data.latitude, data.longitude);
                } else if (data.type === 'clearAllMarkers') {
                  clearAllBookstoreMarkers();
                }
              } catch (error) {
                console.error('Error parsing message from React Native:', error);
              }
            });
          </script>
        </body>
      </html>
    `;
    }, [apiKey, latitude, longitude, regions]);

    useImperativeHandle(ref, () => ({
      postMessage: (message: string) => {
        webViewRef.current?.postMessage(message);
      },
      addBookstoreMarker: addCulturalMarker,
      addAllBookstores: addAllCulturalMarkers,
      clearAllMarkers,
      showMyLocationMarker,
      moveToLocation,
    }));
    // WebView 로드 완료 후 마커 추가
    const handleWebViewLoad = () => {
      console.log("WebView loaded successfully");
      // 지도 로드 후 3초 뒤에 마커 추가 (더 안전한 타이밍)
      setTimeout(() => {
        console.log("Adding cultural markers after map load...");
        console.log("Bookstores data:", bookstores);
        addAllCulturalMarkers();
        // 내 위치 마커는 mapReady 이벤트에서 처리
      }, 3000);
    };

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoad={handleWebViewLoad}
          onError={(e) => console.error("WebView error: ", e.nativeEvent)}
          onMessage={handleMessage}
          androidLayerType="hardware"
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    );
  },
);

KakaoMap.displayName = "KakaoMap";

export default KakaoMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
