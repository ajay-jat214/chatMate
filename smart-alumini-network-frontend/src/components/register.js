import React from "react";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    };
  }

  onEmailChange = (event) => {
    if (event.target) this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onNameChange = (event) => {
    this.setState({ firstname: event.target.value });
  };

  onNameChange2 = (event) => {
    this.setState({ lastname: event.target.value });
  };

  render() {
    return (
      <article className='vh-70 br2 ba dark-gray tc b--black-10 mv8 w-50 mt4 mw6 center shadow-5'>
        <main className='pa4 black-80'>
          <div className='white measure center'>
            <fieldset id='sign_up' className='ba b--transparent shadow5'>
              <legend className='f4 fw6 ph0 mh0 black'>Register</legend>
              <div className='mt3'>
                <label
                  className='db fw6 lh-copy f6 black'
                  htmlFor='email-address'
                >
                  Email
                </label>
                <input
                  className='pa2 black input-reset ba bg-white black hover-bg-black hover-white w-100'
                  type='email'
                  name='email-address'
                  id='email-address'
                  onChange={this.onEmailChange}
                />
              </div>

              <div className='mt3'>
                <label
                  className='db fw6 lh-copy f6 black'
                  htmlFor='email-address'
                >
                  FirstName
                </label>
                <input
                  className='black pa2 input-reset ba bg-white hover-bg-black hover-white w-100'
                  type='text'
                  name='firstname'
                  id='firstname'
                  onChange={this.onNameChange}
                />
              </div>
              <div className='mt3'>
                <label
                  className='db fw6 lh-copy f6 black'
                  htmlFor='email-address'
                >
                  LastName
                </label>
                <input
                  className='black pa2 input-reset ba bg-white hover-bg-black hover-white w-100'
                  type='text'
                  name='lastname'
                  id='lastname'
                  onChange={this.onNameChange2}
                />
              </div>
              <div className='mv3'>
                <label className='db fw6 lh-copy f6 black' htmlFor='password'>
                  Password
                </label>
                <input
                  className='b black pa2 input-reset ba bg-white hover-bg-black hover-white w-100'
                  type='password'
                  name='password'
                  id='password'
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>

            <div className='lh-copy mt3'>
              <input
                onClick={this.onButtonSubmit}
                className='black b ph3 pv2 input-reset ba b--black bg-white grow f6 dib pointer'
                type='submit'
                value='Sign in'
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
