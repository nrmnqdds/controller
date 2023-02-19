import { Icon, useStyleConfig } from "@chakra-ui/react";

const CircleCheck = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 25 25" fill="currentColor" __css={styles} {...rest}>
      <path
        d="M12.1335 4.53199C10.1056 4.72027 8.22587 5.67429 6.8767 7.2006C5.52828 8.72688 4.81238 10.7101 4.87487 12.7453C4.93812 14.7814 5.77457 16.7162 7.21447 18.1568C8.65517 19.5968 10.59 20.4331 12.626 20.4964C14.6614 20.5589 16.6445 19.843 18.1707 18.4946C19.6969 17.1454 20.6511 15.2657 20.8393 13.2377C21.0506 10.8705 20.2015 8.53091 18.5212 6.84988C16.8401 5.16956 14.5006 4.32053 12.1333 4.5318L12.1335 4.53199ZM17.1686 10.7027L12.4267 15.3946C12.1313 15.6826 11.6595 15.6826 11.3641 15.3946L8.56895 12.7253C8.26532 12.4336 8.25492 11.9506 8.54737 11.6462C8.83907 11.3426 9.32204 11.3322 9.62641 11.6247L11.882 13.7886L16.1036 9.61824C16.405 9.33545 16.8768 9.34365 17.1678 9.63833C17.458 9.93229 17.461 10.4048 17.1745 10.7025L17.1686 10.7027Z"
        fill="currentColor"
      />
    </Icon>
  );
};

export default CircleCheck;
