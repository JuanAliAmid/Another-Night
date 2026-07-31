const userDto = (user) => {
    const { password, ...resto } = user;
    return resto;
};

export default userDto;